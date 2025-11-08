using backend.Data;
using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
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
        [HttpPut("profile")]
        public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromForm]UpdateProfileDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            //var updatedProfile = await _authService.UpdateProfileAsync(userId, request);
            var profile = await _context.Profiles
                             .FirstOrDefaultAsync(p => p.UserId == userId);
            if(request.Avatar is null)
            {
                return BadRequest("Avatar is required");
            }
            var avatarUrl = await _fileService.UploadFile(request.Avatar, "user_avatars");
            // Update

            var profileUpdate = new Profile
            {
                Bio = request.Bio,
                FullName = request.FullName,
                TargetScore = request.TargetScore,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                DateOfBirth = request.DateOfBirth,
                AvatarUrl = avatarUrl,
            };

            await _context.SaveChangesAsync();

            return Ok();
        }

        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}
