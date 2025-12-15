using backend.Entities;
using backend.Entities.Notification;
using backend.Models;
using backend.Models.ReadingDto;
using backend.Models.WritingDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpPut("update-profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromForm] UpdateProfileDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var updatedProfile = await _userService.UpdateProfileAsync(userId, request);

            if (updatedProfile == null)
            {
                return NotFound("Profile not found");
            }

            return Ok(updatedProfile);
        }

        [Authorize]
        [HttpPost("attempt-test/{id}")]
        public async Task<ActionResult<object>> AttemptTest(string id)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _userService.AttemptTestAsync(userId, id);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound(new { message = "Test ID not found" });
        }

        [Authorize]
        [HttpPost("submit-test/{resultId}")]
        public async Task<ActionResult<object>> SubmitTest(string resultId, [FromQuery] double accuracy)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _userService.SubmitTestAsync(userId, resultId, accuracy);

            if (result != null)
            {
                return Ok(result);
            }

            return NotFound("Test attempt not found in Reading or Listening records");
        }

        [Authorize]
        [HttpPost("drop-test/{resultId}")]
        public async Task<ActionResult<object>> DropTest(string resultId)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var success = await _userService.DropTestAsync(userId, resultId);

            if (success)
            {
                return Ok(new { message = "Test attempt dropped successfully" });
            }

            return NotFound("Test attempt not found");
        }

        [Authorize]
        [HttpGet("test-history")]
        public async Task<ActionResult<IEnumerable<GetResultDto>>> GetTestHistory()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var history = await _userService.GetTestHistoryAsync(userId);
            return Ok(history);
        }


        [Authorize]
        [HttpGet("notifications")]
        public async Task<ActionResult<IEnumerable<NotificationDto>>> GetNotifications()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var notifications = await _userService.GetNotificationsAsync(userId);
            return Ok(notifications);
        }

        [Authorize]
        [HttpGet("daily-word")]
        public async Task<ActionResult<DailyWord>> GetDailyWord()
        {
            var word = await _userService.GetDailyWordAsync();
            return Ok(word);
        }

        [Authorize]
        [HttpGet("daily-tip")]
        public async Task<ActionResult<DailyTip>> GetDailyTip()
        {
            var tip = await _userService.GetDailyTipAsync();
            return Ok(tip);
        }

        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}