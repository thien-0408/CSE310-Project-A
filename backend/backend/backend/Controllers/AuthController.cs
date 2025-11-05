using backend.Data;
using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;


namespace backend.Controllers
{
    [Route("api/[controller]")]
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

        [HttpPost("register")]
        public async Task<ActionResult<UserProfileDto>> Register(RegisterDto request)
        {
            var userName = await context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);
            if (userName is not null)
            {
                return BadRequest("User Already Exist!");
            }
            var user = new User
            {
                Role = "User",
                UserName = request.UserName,
            };
            
            var HashedPassword = new PasswordHasher<User>().HashPassword(user, request.Password);
            user.PasswordHash = HashedPassword;

            var profile = new Profile
            {
                FullName = request.FullName,
                Email = request.Email,
                User = user,
                AvatarUrl = "/user-avatars/default_avatar.jpg"
            };
            context.Users.Add(user); //add to db
            await context.Profiles.AddAsync(profile);
            await context.SaveChangesAsync();
            var userProfileDto = new UserProfileDto
            {
                Id = user.Id,
                UserName = user.UserName,
                FullName = profile.FullName,
                Email = profile.Email,
                AvatarUrl = profile.AvatarUrl,
                Role = user.Role
            };
            return Ok(userProfileDto);
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
