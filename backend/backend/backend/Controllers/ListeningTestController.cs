using backend.Data;
using backend.Entities;
using backend.Entities.Listening;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.Json;

namespace backend.Controllers
{
    [Route("api/listening-test")]
    [ApiController]
    public class ListeningTestController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public ListeningTestController(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("upload-json-test")]
        public async Task<ActionResult<ListeningTest>> UploadJson([FromForm]UploadJsonTestDto dto)
        {
            if (dto.JsonFile == null) 
            {
                return BadRequest("File is required");
            }
            var jsonUrl = await _fileService.UploadFile(dto.JsonFile, "listening-json");
            var test = new ListeningTest
            {
                Title = dto.title,
                TestType = dto.testType,
                Skill = "listening",
                AudioDuration = dto.audioDuration,
                JsonFileUrl = jsonUrl
            };
            await _context.ListeningTests.AddAsync(test);
            await _context.SaveChangesAsync();
            return Ok(test);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ListeningTest>>> GetAllTest()
        {
            var response = await _context.ListeningTests
                                .Include(t => t.Parts) // <-- THÊM DÒNG NÀY
                                .ToListAsync();
            return Ok(response);
        }
        [HttpPost("add-listening-test")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ListeningTest>> AddListeningTest([FromForm] CreateListeningTestDto request)
        {
            // --- BƯỚC 1: Xử lý chuỗi JSON Parts ---
            // Vì gửi file qua form-data nên Parts bắt buộc phải là string JSON để tránh lỗi binding
            List<CreateListeningPartDto> partsList = new();
            try
            {
                if (!string.IsNullOrEmpty(request.Parts))
                {
                    partsList = JsonConvert.DeserializeObject<List<CreateListeningPartDto>>(request.Parts)
                                ?? new List<CreateListeningPartDto>();
                }
            }
            catch (System.Text.Json.JsonException ex) // Bắt lỗi format JSON
            {
                return BadRequest(new { message = "Lỗi định dạng JSON ở trường 'Parts'", detail = ex.Message });
            }

            // --- BƯỚC 2: Xử lý Upload File qua Service ---
            string audioUrl = string.Empty;
            string imageUrl = string.Empty;

            try
            {
                // Kiểm tra null trước khi gọi service để tránh lỗi
                if (request.Audio != null)
                {
                    // Lưu vào thư mục 'listening_audios' trong wwwroot
                    audioUrl = await _fileService.UploadFile(request.Audio, "listening_audios");
                }

                if (request.Image != null)
                {
                    // Lưu vào thư mục 'listening_images' trong wwwroot
                    imageUrl = await _fileService.UploadFile(request.Image, "listening_images");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Lỗi khi upload file", detail = ex.Message });
            }

            // --- BƯỚC 3: Lưu vào Database (Transaction) ---
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                // A. Tạo Test
                var test = new ListeningTest
                {
                    Title = request.Title,
                    TestType = request.TestType,
                    Skill = request.Skill,
                    QuestionRange = request.QuestionRange,
                    SubTitle = request.SubTitle,
                    AudioDuration = request.AudioDuration,
                    JsonFileUrl = "",

                    // Gán URL đã lấy được từ FileService
                    AudioUrl = audioUrl,
                    ImageUrl = imageUrl,

                    Parts = new List<ListeningPart>()
                };

                // B. Map dữ liệu từ partsList (đã deserialize ở Bước 1)
                foreach (var partDto in partsList)
                {
                    var part = new ListeningPart
                    {
                        PartId = Guid.NewGuid().ToString(),
                        PartNumber = partDto.PartNumber,
                        PartTitle = partDto.PartTitle,
                        Context = partDto.Context,
                        QuestionRange = partDto.QuestionRange,
                        PartAudioUrl = partDto.PartAudioUrl,
                        // Lưu ý: Nếu PartAudioUrl cũng cần upload file riêng, bạn cần logic upload tương tự ở trên
                        Sections = new List<ListeningSection>()
                    };

                    foreach (var sectionDto in partDto.Sections)
                    {
                        var section = new ListeningSection
                        {
                            SectionId = Guid.NewGuid().ToString(),
                            SectionNumber = sectionDto.SectionNumber,
                            SectionRange = sectionDto.SectionRange,
                            SectionTitle = sectionDto.SectionTitle,
                            QuestionType = sectionDto.QuestionType,
                            Instructions = sectionDto.Instructions,
                            WordLimit = sectionDto.WordLimit,
                            MaxAnswers = sectionDto.MaxAnswers,
                            MapImageUrl = sectionDto.MapImageUrl,
                            Questions = new List<ListeningQuestion>()
                        };

                        foreach (var questionDto in sectionDto.Questions)
                        {
                            var question = new ListeningQuestion
                            {
                                QuestionId = Guid.NewGuid().ToString(),
                                QuestionNumber = questionDto.QuestionNumber,
                                QuestionText = questionDto.QuestionText,
                                Label = questionDto.Label,
                                Value = questionDto.Value,
                                IsInput = questionDto.IsInput,
                                WordLimit = questionDto.WordLimit,
                                Answers = new List<ListeningAnswer>(),
                                QuestionOptions = new List<ListeningOption>()
                            };

                            if (questionDto.Answers != null)
                            {
                                foreach (var ans in questionDto.Answers)
                                {
                                    question.Answers.Add(new ListeningAnswer
                                    {
                                        AnswerId = Guid.NewGuid().ToString(),
                                        AnswerText = ans.AnswerText
                                    });
                                }
                            }

                            if (questionDto.QuestionOptions != null)
                            {
                                foreach (var opt in questionDto.QuestionOptions)
                                {
                                    question.QuestionOptions.Add(new ListeningOption
                                    {
                                        // OptionId tự tăng nên không cần set
                                        Key = opt.Key,
                                        Text = opt.Text
                                    });
                                }
                            }
                            section.Questions.Add(question);
                        }
                        part.Sections.Add(section);
                    }
                    test.Parts.Add(part);
                }

                _context.ListeningTests.Add(test);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new
                {
                    message = "Tạo đề thi thành công",
                    testId = test.TestId,
                    audioUrl = test.AudioUrl,
                    imageUrl = test.ImageUrl
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Log ex here
                return StatusCode(500, new { message = "Lỗi server khi lưu dữ liệu", error = ex.Message });
            }
        }
    }
}
