using backend.Data;
using backend.Entities.Reading;
using backend.Models.ReadingDto;
using backend.Services; // Namespace chứa IFileService
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace backend.Controllers
{
    [Route("api/reading-test")]
    [ApiController]
    public class ReadingTestController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public ReadingTestController(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        [HttpPost("add-reading-test")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ReadingTest>> AddReadingTest([FromForm] CreateReadingTestDto request)
        {
            // 1. Validate & Parse JSON
            List<ReadingPartDto> partsList;
            try
            {
                if (string.IsNullOrEmpty(request.Parts))
                    return BadRequest("Parts JSON is required");

                partsList = JsonConvert.DeserializeObject<List<ReadingPartDto>>(request.Parts)
                            ?? new List<ReadingPartDto>();
            }
            catch (JsonException ex)
            {
                return BadRequest($"JSON Error: {ex.Message}");
            }

            // 2. Upload Image
            string imageUrl = string.Empty;
            if (request.Image != null)
            {
                imageUrl = await _fileService.UploadFile(request.Image, "reading_images");
            }
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                var test = new ReadingTest
                {
                    TestId = Guid.NewGuid().ToString(), 
                    Title = request.Title,
                    TestType = request.TestType,
                    Skill = request.Skill,
                    TotalDuration = request.TotalDuration,
                    QuestionRange = request.QuestionRange,
                    Subtitle = request.Subtitle,
                    ImageUrl = imageUrl,
                    Parts = new List<ReadingPart>()
                };

                foreach (var partDto in partsList)
                {
                    var part = new ReadingPart
                    {
                        PartId = Guid.NewGuid(), // NEW GUID
                        PartNumber = partDto.PartNumber, 
                        PartTitle = partDto.PartTitle,
                        PassageTitle = partDto.PassageTitle,
                        Text = partDto.Text,
                        Skill = "reading",
                        Sections = new List<ReadingSection>()
                    };

                    foreach (var secDto in partDto.Sections)
                    {
                        var section = new ReadingSection
                        {
                            SectionId = Guid.NewGuid(), // NEW GUID
                            SectionNumber = secDto.SectionNumber,
                            SectionTitle = secDto.SectionTitle,
                            SectionRange = secDto.SectionRange,
                            QuestionType = secDto.QuestionType,
                            Instructions = secDto.Instructions,
                            WordLimit = secDto.WordLimit,

                            GapFillText = secDto.Text,
                            TableJson = secDto.Table != null ? JsonConvert.SerializeObject(secDto.Table) : null,
                            OptionRange = secDto.Options != null ? string.Join(",", secDto.Options) : null,

                            Questions = new List<ReadingQuestion>(),
                            SectionOptions = new List<SectionOption>()
                        };

                        if (secDto.Headings != null)
                        {
                            for (int i = 0; i < secDto.Headings.Count; i++)
                            {
                                section.SectionOptions.Add(new SectionOption
                                {
                                    Text = secDto.Headings[i],
                                    Key = (i + 1).ToString() 
                                });
                            }
                        }

                        // Map Questions
                        foreach (var qDto in secDto.Questions)
                        {
                            var question = new ReadingQuestion
                            {
                                Id = Guid.NewGuid(), // NEW GUID
                                QuestionNumber = qDto.QuestionNumber, 
                                QuestionText = qDto.Question,
                                DiagramLabelsJson = qDto.Diagram != null ? JsonConvert.SerializeObject(qDto.Diagram) : null,
                                Answers = new List<QuestionAnswer>(),
                                Options = new List<QuestionOption>()
                            };

                            // Map Options (A, B, C, D)
                            if (qDto.Options != null)
                            {
                                for (int i = 0; i < qDto.Options.Count; i++)
                                {
                                    question.Options.Add(new QuestionOption
                                    {
                                        Id = Guid.NewGuid(),
                                        Index = i, 
                                        Text = qDto.Options[i]
                                    });
                                }
                            }

                            // Map Answers
                            MapAnswersToEntity(question, qDto.Answer);

                            section.Questions.Add(question);
                        }
                        part.Sections.Add(section);
                    }
                    test.Parts.Add(part);
                }

                _context.ReadingTests.Add(test);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { message = "Test Created Successfully", testId = test.TestId });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Server Error", error = ex.Message, stack = ex.StackTrace });
            }
        }

        private void MapAnswersToEntity(ReadingQuestion question, object answerData)
        {
            if (answerData == null) return;

            //Helper for adding answer with new guid 
            void AddAns(string content, int index)
            {
                question.Answers.Add(new QuestionAnswer
                {
                    Id = Guid.NewGuid(),
                    Index = index,
                    Content = content
                });
            }

            if (answerData is JArray jArray)
            {
                int idx = 0;
                foreach (var item in jArray)
                {
                    AddAns(item.ToString(), idx++);
                }
            }
            else
            {
                AddAns(answerData.ToString(), 0);
            }
        }
    
        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<ReadingTest>>> GetAllReadingTests()
        {
            var tests = await _context.ReadingTests
                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.Questions)
                            .ThenInclude(q => q.Answers)

                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.Questions)
                            .ThenInclude(q => q.Options)
                .AsSplitQuery()
                .ToListAsync();
            foreach (var test in tests)
            {
                // Sort parts
                test.Parts = test.Parts.OrderBy(p => p.PartNumber).ToList();

                foreach (var part in test.Parts)
                {
                    part.Sections = part.Sections
                        .Where(s => s.SectionNumber > 0) 
                        .OrderBy(s => s.SectionNumber)
                        .ToList();

                    foreach (var section in part.Sections)
                    {
                        section.Questions = section.Questions
                            .Where(q => q.QuestionNumber > 0)
                            .OrderBy(q => q.QuestionNumber)
                            .ToList();

                        // Sort options 
                        foreach (var q in section.Questions)
                        {
                            if (q.Options != null)
                            {
                                q.Options = q.Options.OrderBy(o => o.Index).ToList();
                            }
                        }
                    }
                }
            }
            return Ok(tests);
        }
    }
}