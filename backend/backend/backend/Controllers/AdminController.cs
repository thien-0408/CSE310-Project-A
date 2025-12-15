using backend.Entities.Notification;
using backend.Entities.User;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IAuthService _authService;
        public AdminController(IAdminService adminService, IAuthService authService)
        {
            _authService = authService;
            _adminService = adminService;
        }


        /// Get user list
        [Authorize(Roles = "Admin")]
        [HttpGet("fetch-users")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUser()
        {
            var userList = await _adminService.GetAllUsersAsync();
            return Ok(userList);
        }


        /// Create account
        [HttpPost("create-account")]
        public async Task<ActionResult<User>> CreateAccount(AddUserDto newUser)
        {
            var result = await _adminService.CreateAccountAsync(newUser);
            if (result == null)
            {
                return BadRequest("User already exist");
            }
            return Ok(result);
        }



        /// Toggle status 
        [Authorize(Roles = "Admin")]
        [HttpPatch("activate-user/{userName}")]
        public async Task<ActionResult<User>> ActivateUser(string userName)
        {
            var success = await _adminService.ActivateUserAsync(userName);
            if (!success) return NotFound("User not found");
            return Ok("User activated");
        }

        // Delete user
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-user/{username}")]
        public async Task<ActionResult<User>> DeleteUser(string username)
        {
            var success = await _adminService.DeleteUserAsync(username);
            if (!success) return NotFound("User not found");
            return Ok($"Removed user {username}");
        }


        // Deactivate user
        [Authorize(Roles = "Admin")]
        [HttpPatch("deactivate-user/{username}")]
        public async Task<ActionResult<User>> DeActivateUser(string username)
        {
            var success = await _adminService.DeactivateUserAsync(username);
            if (!success) return NotFound("User not found");
            return Ok("User deactivated!");
        }


        // Get profile
        [HttpGet("profile")]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult<UserProfileDto>> GetMyProfile()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await _authService.GetProfileAsync(userId);
            if (profile is null) return NotFound();

            return Ok(profile);
        }

        //Log out
        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult<User>> Logout()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }
            await _authService.LogoutAsync(userId);
            return Ok("Logged out successfully");
        }

        // Add daily word
        [Authorize(Roles = "Admin")]
        [HttpPost("add-daily-word")]
        public async Task<ActionResult<DailyWord>> AddDailyWord([FromBody] DailyWord request)
        {
            var result = await _adminService.AddOrUpdateDailyWordAsync(request);
            return Ok(result);
        }


        //Add daily tip
        [Authorize(Roles = "Admin")]
        [HttpPost("add-daily-tip")]
        public async Task<ActionResult<DailyTip>> AddDailyTip([FromBody] DailyTip request)
        {
            var result = await _adminService.AddOrUpdateDailyTipAsync(request);
            return Ok(result);
        }
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }

    }
}
