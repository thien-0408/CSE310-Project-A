using backend.Data;
using backend.Entities;
using backend.Entities.User;
using backend.Models;
using backend.Models.ReadingDto;
using backend.Models.WritingDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public UserController(UserDbContext context, IFileService service)
        {
            _context = context;
            _fileService = service;
        }
        //Edit profile
        [Authorize]
        [HttpPut("update-profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromForm] UpdateProfileDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _context.Profiles
                                        .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null)
            {
                return NotFound("Profile not found");
            }

            // Only update if a new file is provided
            if (request.Avatar != null)
            {                
                var avatarUrl = await _fileService.UploadFile(request.Avatar, "user_avatars");
                profile.AvatarUrl = avatarUrl; // Update the URL
            }

            profile.Bio = request.Bio;
            profile.FullName = request.FullName;
            profile.TargetScore = request.TargetScore;
            profile.Email = request.Email;
            profile.PhoneNumber = request.PhoneNumber;
            profile.DateOfBirth = request.DateOfBirth;

            await _context.SaveChangesAsync();
            return Ok(profile); 
        }


        //Call api to take the test 
        [Authorize]
        [HttpPost("attempt-test/{id}")]
        public async Task<ActionResult<object>> AttemptTest(string id)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            // --- CHECK 1: Có phải READING TEST không? ---
            var readingTest = await _context.ReadingTests.FindAsync(id);
            if (readingTest != null)
            {
                var readingAttempt = new ReadingTestResult
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    TestId = id,
                    Skill = "Reading",
                    IsCompleted = false,
                    TakenDate = DateTime.UtcNow,
                    FinishDate = DateTime.UtcNow,
                    Title = readingTest.Title,
                    Score = 0
                };
                _context.ReadingTestResults.Add(readingAttempt);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    id = readingAttempt.Id,
                    skill = "Reading",
                    message = "Reading attempt started"
                });
            }

            
            if (Guid.TryParse(id, out var writingTestId))
            {
                var writingTest = await _context.WritingTests.FindAsync(writingTestId);
                if (writingTest != null)
                {
                    var writingAttempt = new WritingSubmission
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = userId,
                        TestId = writingTestId.ToString(),
                        Content = "", // Chưa làm gì
                        WordCount = 0,
                        SubmittedDate = DateTime.UtcNow,
                        Status = "Draft" 
                    };

                    _context.WritingSubmissions.Add(writingAttempt);
                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        id = writingAttempt.Id,
                        skill = "Writing",
                        message = "Writing attempt started"
                    });
                }
            }
            return NotFound(new { message = "Test ID not found in any skill category" });
        }

        //Submit
        [Authorize]
        [HttpPost("submit-test/{resultId}")]
        public async Task<ActionResult<ReadingTestResult>> SubmitTest(string resultId, [FromQuery] double accuracy)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();
            if (!Guid.TryParse(resultId, out var parsedResultId))
            {
                return BadRequest("Invalid Result ID");
            }
            var testAttempt = await _context.ReadingTestResults
                                           .FirstOrDefaultAsync(r => r.Id == parsedResultId && r.UserId == userId);

            if (testAttempt == null)
            {
                return NotFound("Test attempt not found");
            }

            testAttempt.Score = accuracy;
            testAttempt.IsCompleted = true;
            testAttempt.FinishDate = DateTime.UtcNow; 

            await _context.SaveChangesAsync();
            return Ok(testAttempt);
        }
        [Authorize]
        [HttpPost("drop-test/{resultId}")]
        public async Task<ActionResult<ReadingTestResult>> DropTest(string resultId)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();
            if (!Guid.TryParse(resultId, out var parsedResultId))
            {
                return BadRequest("Invalid Result ID");
            }
            var testAttempt = await _context.ReadingTestResults
                                           .FirstOrDefaultAsync(r => r.Id == parsedResultId && r.UserId == userId);

            if (testAttempt == null)
            {
                return NotFound("Test attempt not found");
            }
            testAttempt.FinishDate = DateTime.UtcNow;
            testAttempt.Score = 0;
            testAttempt.IsCompleted = false;
            await _context.SaveChangesAsync();
            return Ok(testAttempt);
        }
        //Get history
        [Authorize]
        [HttpGet("test-history")]
        public async Task<ActionResult<IEnumerable<GetResultDto>>> GetTestHistory()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();
            var readingList = await _context.ReadingTestResults
                .Where(r => r.UserId == userId)
                .Select(r => new GetResultDto
                {
                    TestId = Guid.Parse(r.TestId),
                    Accuracy = r.Score,
                    IsCompleted = r.IsCompleted,
                    Skill = "Reading",
                    Title = r.Title,
                    TakenDate = r.TakenDate,
                    FinishDate = (DateTime)(r.FinishDate == DateTime.MinValue ? r.TakenDate : r.FinishDate)
                })
                .ToListAsync();
            var writingList = await _context.WritingSubmissions
                .Include(s => s.WritingTest)
                .Include(s => s.Result)
                .Where(s => s.UserId == userId)
                .Select(s => new GetResultDto
                {
                    TestId = Guid.Parse(s.TestId),
                    Accuracy = s.Result != null ? s.Result.OverallScore : 0,
                    IsCompleted = s.Status != "Draft",
                    Skill = "Writing",
                    Title = s.WritingTest.Title,
                    TakenDate = s.SubmittedDate,
                    FinishDate = s.Result != null ? s.Result.GradedDate : s.SubmittedDate
                })
                .ToListAsync();
            var combinedHistory = readingList
                .Concat(writingList)
                .OrderByDescending(r => r.TakenDate)
                .ToList();

            return Ok(combinedHistory);
        }

        //Get best result for each test
        [Authorize]
        [HttpGet("test-best-results")]
        public async Task<ActionResult<IEnumerable<GetResultDto>>> GetUserBestResults()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var bestResults = await _context.ReadingTestResults
                .Where(r => r.UserId == userId && r.IsCompleted) 
                .GroupBy(r => r.TestId) 
                .Select(g => new GetResultDto
                {
                    TestId = Guid.Parse(g.Key),
                    Accuracy = g.Max(x => x.Score),
                    Title = g.FirstOrDefault().Title,
                    Skill = g.FirstOrDefault().Skill,
                    TakenDate = g.OrderByDescending(x => x.Score).FirstOrDefault().TakenDate,
                    FinishDate = (DateTime)g.OrderByDescending(x => x.Score).FirstOrDefault().FinishDate,
                    IsCompleted = true
                })
                .ToListAsync();

            return Ok(bestResults);
        }
        [Authorize]
        [HttpGet("notifications")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
        {
            var userId = GetUserIdFromToken();

            var notifications = await _context.WritingSubmissions
                .Include(s => s.WritingTest)
                .Include(s => s.Result)
                .Where(s => s.UserId == userId && s.Status == "Graded")
                .OrderByDescending(s => s.Result.GradedDate) 
                .Take(10) 
                .Select(s => new NotificationDto
                {
                    SubmissionId = s.Id,
                    TestTitle = s.WritingTest.Title,
                    Score = s.Result.OverallScore,
                    GradedDate = s.Result.GradedDate,
                    IsRead = false 
                })
                .ToListAsync();

            return Ok(notifications);
        }
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}
