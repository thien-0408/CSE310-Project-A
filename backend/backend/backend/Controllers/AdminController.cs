using Azure.Core;
using backend.Data;
using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IAuthService _authService;
        public AdminController(UserDbContext context, IAuthService authService)
        {
            _authService = authService;
            _context = context;
        }
        [Authorize(Roles ="Admin")]
        [HttpGet("fetch-users")]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUser()
        {
            var userList = await _context.Users.Select(u => new UserListDto
            {
                Id = u.Id,
                UserName = u.UserName,
                UserRole = u.Role,
                IsActived = u.IsActive
            }).ToListAsync();
            return Ok(userList);
        }
        [HttpPost("create-account")]
        public async Task<ActionResult<User>> CreateAccount(AddUserDto newUser)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == newUser.UserName))
            {
                return BadRequest("User already exist");
            }
            var user = new User
            {
                Role = newUser.Role,
                UserName = newUser.UserName,
            };
            var HashedPassword = new PasswordHasher<User>().HashPassword(user, newUser.Password);
            user.PasswordHash = HashedPassword;

           
            _context.Users.Add(user); 
            await _context.SaveChangesAsync();
            return Ok(user);
        }
        [Authorize(Roles ="Admin")]
        [HttpPatch("activate-user/{userName}")]
        public async Task<ActionResult<User>> ActivateUser(string userName)
        {
            var userToModify = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (userToModify == null)
            {
                return NotFound("User not found");
            }
            userToModify.IsActive = true;
            await _context.SaveChangesAsync();
            return Ok("User activated");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-user/{username}")]
        public async Task<ActionResult<User>> DeleteUser(string username) 
        {
            var userToDelete = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username); 
            if (userToDelete == null)
            {
                return NotFound("User not found");
            }
            _context.Users.Remove(userToDelete);
            await _context.SaveChangesAsync();
            return Ok($"Removed user {username}");
        }
        [Authorize(Roles ="Admin")]
        [HttpPatch("deactivate-user/{username}")]
        public async Task<ActionResult<User>> DeActivateUser(string username)
        {
            var userToDeactivate = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (userToDeactivate is null) 
            {
                return NotFound("User not found");
            }
            userToDeactivate.IsActive = false; // assign to false
            await _context.SaveChangesAsync();
            return Ok("User deactivated!");
        }

        [Authorize]
        [HttpGet("admin-only")]
        public IActionResult AdminOnlyEndPoint()
        {
            return Ok("You're Admin");
        }
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
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }

    }
}
