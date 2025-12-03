using backend.Data;
using backend.Entities.User;
using backend.Entities.Writing;
using backend.Models.WritingDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/writing-test")]
    [ApiController]
    public class WritingTestController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;
        public WritingTestController(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
       public async Task<ActionResult<WritingTest>> CreateWritingTest([FromForm] CreateWritingTestDto request)
        {
            var user = GetUserIdFromToken();
            if (user == Guid.Empty) return Unauthorized();

            string imageUrl = string.Empty;
            if(request.Image != null)
            {
                imageUrl = await _fileService.UploadFile(request.Image, "writing_images");
            }
            var writingTest = new WritingTest
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title,
                Subtitle = request.Subtitle, //Discuss both views,...
                Topic = request.Topic,
                ImageUrl = imageUrl,
                Duration = request.Duration,
                TestType = request.TestType, // Task 1 -2
                Skill = request.Skill,
                CreatedAt = DateTime.UtcNow,
            };
            await _context.WritingTests.AddAsync(writingTest);
            await _context.SaveChangesAsync();
            return Ok(writingTest);
        }
        [HttpGet("get-test/{id}")]
        public async Task<ActionResult<WritingTest>> GetWritingTestById(string id)
        {
            var test = await _context.WritingTests.FindAsync(id);
            if (test == null) return NotFound();
            return Ok(test);
        }
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
        [Authorize]
        [HttpPost("submit")]
        public async Task<ActionResult<WritingSubmission>> SubmitWritingTest([FromBody] SubmitWritingDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var test = await _context.WritingTests.FindAsync(request.TestId);
            if (test == null)
            {
                return NotFound("Writing Test not found");
            }
            var submission = new WritingSubmission
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                TestId = request.TestId,
                Content = request.Content,
                WordCount = request.WordCount,
                SubmittedDate = DateTime.UtcNow,
                Status = "Pending" 
            };
            _context.WritingSubmissions.Add(submission);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Submitted successfully", submissionId = submission.Id });
        }


        /// <summary>
        /// admin get pending tests to display
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<WritingSubmissionSummaryDto>>> GetPendingSubmissions()
        {
            var submissions = await _context.WritingSubmissions
                .Include(s => s.User)
                .Include(s => s.WritingTest)
                .Where(s => s.Status == "Pending")
                .OrderByDescending(s => s.SubmittedDate)
                .Select(s => new WritingSubmissionSummaryDto
                {
                    SubmissionId = s.Id,
                    TestTitle = s.WritingTest.Title,
                    UserName = s.User.UserName,
                    UserEmail = s.User.Profile.Email,
                    SubmittedDate = s.SubmittedDate,
                    Status = s.Status,
                    ImageUrl = s.User.Profile.AvatarUrl ?? ""
                })
                .ToListAsync();

            return Ok(submissions);
        }


        /// <summary>
        /// Get submission detail
        /// </summary>
        [Authorize]
        [HttpGet("user-submission/{id}")]
        public async Task<ActionResult> GetSubmissionDetail(Guid id)
        {
            var submission = await _context.WritingSubmissions
                .Include(s => s.WritingTest)
                .Include(s => s.User)
                .Include(s => s.Result) 
                .FirstOrDefaultAsync(s => s.Id == id.ToString());

            if (submission == null) return NotFound();

            return Ok(new
            {
                submission.Id,
                TestTitle = submission.WritingTest.Title,
                Topic = submission.WritingTest.Topic,
                TestImage = submission.WritingTest.ImageUrl,
                StudentName = submission.User.UserName, // Hoặc FullName
                submission.Content,
                submission.WordCount,
                submission.SubmittedDate,

                // --- THÊM CÁC TRƯỜNG KẾT QUẢ ---
                HasResult = submission.Result != null,
                OverallScore = submission.Result?.OverallScore ?? 0,
                GeneralFeedback = submission.Result?.GeneralFeedback,
                GrammarFeedback = submission.Result?.GrammarFeedback,
                VocabularyFeedback = submission.Result?.VocabularyFeedback,
                GradedDate = submission.Result?.GradedDate
            });
        }


        /// <summary>
        /// Grading for user 
        /// </summary>
        [Authorize(Roles = "Admin")]
        [HttpPost("grade")]
        public async Task<ActionResult> GradeSubmission([FromBody] GradeWritingSubmissionDto request)
        {
            var submission = await _context.WritingSubmissions
                .FirstOrDefaultAsync(s => s.Id == request.SubmissionId);

            if (submission == null) return NotFound("Submission not found");

            if (submission.Status == "Graded")
                return BadRequest("This submission has already been graded.");

            var result = new WritingResult
            {
                Id = Guid.NewGuid().ToString(),
                SubmissionId = request.SubmissionId,

                TaskResponseScore = request.TaskResponse,
                CoherenceCohesionScore = request.CoherenceCohesion,
                LexicalResourceScore = request.LexicalResource,
                GrammaticalRangeAccuracyScore = request.GrammaticalRange,
                OverallScore = request.OverallScore,
                GeneralFeedback = request.GeneralFeedback,
                GrammarFeedback = request.GrammerFeedback,
                VocabularyFeedback = request.VocabularyFeedback,
                GradedDate = DateTime.UtcNow,
            };
            submission.Status = "Graded";
            using var transaction = _context.Database.BeginTransaction();
            try
            {
                _context.WritingResults.Add(result);
                _context.WritingSubmissions.Update(submission); // Update status

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok(new { message = "Grading saved successfully", resultId = result.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, "Error saving grading result: " + ex.Message);
            }
        }

        /// <summary>
        /// Delete submission
        /// </summary>
        [Authorize(Roles ="Admin")]
        [HttpDelete("delete/submission/{id}")]
        public async Task<ActionResult<WritingSubmission>> DeleteSubmission(string id)
        {
            var submission = await _context.WritingSubmissions.FindAsync(id);
            if(submission is null)
            {
                return NotFound();
            }
            _context.WritingSubmissions.Remove(submission);
            return Ok("Submission removed");
        }
    }
}
