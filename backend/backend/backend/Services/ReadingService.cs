using backend.Data;
using backend.Entities.Reading;
using backend.Models.ReadingDto;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace backend.Services
{
    public class ReadingService : IReadingService
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public ReadingService(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<ReadingTest> CreateReadingTestAsync(CreateReadingTestDto request)
        {
            // 1. Parse JSON
            List<ReadingPartDto> partsList;
            try
            {
                if (string.IsNullOrEmpty(request.Parts))
                    throw new ArgumentException("Parts JSON is required");

                partsList = JsonConvert.DeserializeObject<List<ReadingPartDto>>(request.Parts)
                            ?? new List<ReadingPartDto>();
            }
            catch (JsonException ex)
            {
                throw new ArgumentException($"JSON Error: {ex.Message}");
            }

            // 2. Upload Image
            string imageUrl = string.Empty;
            if (request.Image != null)
            {
                imageUrl = await _fileService.UploadFile(request.Image, "reading_images");
            }

            // 3. Transaction & Mapping Logic
            using var transaction = await _context.Database.BeginTransactionAsync();
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
                        PartId = Guid.NewGuid(),
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
                            SectionId = Guid.NewGuid(),
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

                        // Map Headings
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

                        // Map Matching Options
                        if (secDto.MatchingOptions != null)
                        {
                            for (int i = 0; i < secDto.MatchingOptions.Count; i++)
                            {
                                section.SectionOptions.Add(new SectionOption
                                {
                                    Text = secDto.MatchingOptions[i],
                                    Key = ((char)('A' + i)).ToString()
                                });
                            }
                        }

                        // Map Questions
                        foreach (var qDto in secDto.Questions)
                        {
                            var question = new ReadingQuestion
                            {
                                Id = Guid.NewGuid(),
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

                            // Map Answers (Gọi hàm helper private)
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

                return test;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<IEnumerable<ReadingTest>> GetAllReadingTestsAsync()
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
                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.SectionOptions)
                .AsSplitQuery()
                .ToListAsync();

            // In-memory Sort
            foreach (var test in tests)
            {
                SortTestComponents(test);
            }
            return tests;
        }

        public async Task<ReadingTest?> GetReadingTestByIdAsync(Guid id)
        {
            var test = await _context.ReadingTests
                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.Questions)
                            .ThenInclude(q => q.Answers)
                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.Questions)
                            .ThenInclude(q => q.Options)
                .Include(t => t.Parts)
                    .ThenInclude(p => p.Sections)
                        .ThenInclude(s => s.SectionOptions)
                .AsSplitQuery()
                .FirstOrDefaultAsync(t => t.TestId == id.ToString());

            if (test != null)
            {
                SortTestComponents(test);
            }

            return test;
        }

        // --- Private Helper Methods ---

        private void MapAnswersToEntity(ReadingQuestion question, object answerData)
        {
            if (answerData == null) return;

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

        private void SortTestComponents(ReadingTest test)
        {
            if (test.Parts == null) return;

            test.Parts = test.Parts.OrderBy(p => p.PartNumber).ToList();

            foreach (var part in test.Parts)
            {
                if (part.Sections == null) continue;

                part.Sections = part.Sections
                    .Where(s => s.SectionNumber > 0)
                    .OrderBy(s => s.SectionNumber)
                    .ToList();

                foreach (var section in part.Sections)
                {
                    if (section.Questions != null)
                    {
                        section.Questions = section.Questions
                            .Where(q => q.QuestionNumber > 0)
                            .OrderBy(q => q.QuestionNumber)
                            .ToList();

                        foreach (var q in section.Questions)
                        {
                            if (q.Options != null)
                            {
                                q.Options = q.Options.OrderBy(o => o.Index).ToList();
                            }
                        }
                    }

                    if (section.SectionOptions != null)
                    {
                        section.SectionOptions = section.SectionOptions.OrderBy(o => o.Id).ToList();
                    }
                }
            }
        }
    }
}