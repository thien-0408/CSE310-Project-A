using backend.Data;
using backend.Entities;
using backend.Entities.User;
using backend.Models;
using backend.Models.ReadingDto;
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
        public async Task<ActionResult<ReadingTestResult>> AttemptTest(string id)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();
            var test = await _context.ReadingTests.FindAsync(id);
            if (test == null)
            {
                return NotFound("Test not found");
            }
            var testAttempt = new ReadingTestResult
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TestId = id,
                Skill = "reading",
                IsCompleted = false,
                TakenDate = DateTime.UtcNow,
                Title = test.Title
            };
            _context.ReadingTestResults.Add(testAttempt);
            await _context.SaveChangesAsync();
            return Ok(testAttempt);
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
            var readingHistory = await _context.ReadingTestResults.Where(r => r.UserId == userId)
                .OrderByDescending(r => r.TakenDate).Select(r => new GetResultDto
                {
                    TestId = Guid.Parse(r.TestId),
                    Accuracy = r.Score,
                    IsCompleted = r.IsCompleted,
                    Skill = r.Skill,
                    Title = r.Title,
                    TakenDate = r.TakenDate,
                    FinishDate = (DateTime)r.FinishDate
                }).ToListAsync();
            return Ok(readingHistory);
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
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}
