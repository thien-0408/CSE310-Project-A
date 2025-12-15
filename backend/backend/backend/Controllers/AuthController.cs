using backend.Data;
using backend.Entities.User;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserDbContext context;
        private readonly IAuthService authService;
        public AuthController(UserDbContext _context, IAuthService sv)
        {
            context = _context;
            authService = sv;
        }


        // Register
        [HttpPost("register")]
        public async Task<ActionResult<UserProfileDto>> Register(RegisterDto request)
        {
            var result = await authService.RegisterAsync(request);

            if (result == null)
            {
                return BadRequest("User Already Exist!");
            }

            return Ok(result);
        }

        //Login 
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var token = await authService.LoginAsync(request);
            
            if (token is null)
            {
                return BadRequest("Invalid Username or Password or Account has been banned");
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
            var userId = GetUserIdFromToken(); 
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await authService.GetProfileAsync(userId);
            if (profile is null) return NotFound();

            return Ok(profile);
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


        //Change pass
        [Authorize]
        [HttpPatch("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }
            var success = await authService.ChangePasswordAsync(userId, request);
            if (success)
            {
                return Ok("Password changed successfully");
            }
            return BadRequest("Invalid current password");
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
    }
}
