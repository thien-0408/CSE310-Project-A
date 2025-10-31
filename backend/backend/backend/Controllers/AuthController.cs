using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserProfileDto>> Register(RegisterDto request)
        {
            var user = await authService.RegisterAsync(request);
            if (user is null)
            {
                return BadRequest("User Already Exist!");
            }
            var userProfile = await authService.GetProfileAsync(user.Id);
            return Ok(userProfile);
        }
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var token = await authService.LoginAsync(request);
            if (token is null)
            {
                return BadRequest("Invalid Username or Password");
            }
            return Ok(token);
        }
        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokenAsync(request);
            if(result is null || request.AccessToken is null || result.RefreshToken is null)
            {
                return Unauthorized("Invalid Token!");
            }
            return Ok(result);
        }

        //Get profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserProfileDto>> GetMyProfile()
        {
            var userId = GetUserIdFromToken(); // Hàm helper của bạn
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await authService.GetProfileAsync(userId);
            if (profile is null) return NotFound();

            return Ok(profile);
        }
        //Edit profile
        [HttpPut("profile")]
        [Authorize]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile(UpdateProfileDto request) // Sửa DTO
        {
            var userId = GetUserIdFromToken(); // Hàm helper của bạn
            if (userId == Guid.Empty) return Unauthorized();

            var updatedProfile = await authService.UpdateProfileAsync(userId, request);
            if (updatedProfile is null) return NotFound();

            return Ok(updatedProfile);
        }

        //Logout API
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userId = GetUserIdFromToken();
            if(userId == Guid.Empty)
            {
                return Unauthorized();
            }
            await authService.LogoutAsync(userId);
            return Ok("Logged out successfully");
        }
        
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
        //User authentication
        [Authorize]
        [HttpGet]
        public IActionResult AuthenticationEndPoint()
        {
            return Ok("You're authenticated");
        }
        //Admin auth
        [Authorize(Roles = "Admin")]
        [HttpGet("admin-only")]
        public IActionResult AdminOnlyEndPoint()
        {
            return Ok("You're Admin");
        }
    }
}
