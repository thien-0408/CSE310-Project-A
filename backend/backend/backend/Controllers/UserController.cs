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

            // 3. Handle Avatar (Only update if a new file is provided)
            if (request.Avatar != null)
            {
                // Optional: Delete old avatar from disk here if you want to save space

                var avatarUrl = await _fileService.UploadFile(request.Avatar, "user_avatars");
                profile.AvatarUrl = avatarUrl; // Update the URL
            }
            // If request.Avatar is null, we do NOTHING (keep the old AvatarUrl)

            // 4. Update the other fields on the EXISTING 'profile' object
            // Note: We check if values are null/empty to avoid wiping data if the frontend sends nulls, 
            // or you can assign directly if your frontend always sends full data.
            profile.Bio = request.Bio;
            profile.FullName = request.FullName;
            profile.TargetScore = request.TargetScore;
            profile.Email = request.Email;
            profile.PhoneNumber = request.PhoneNumber;
            profile.DateOfBirth = request.DateOfBirth;

            // 5. Save changes to the tracked entity
            await _context.SaveChangesAsync();

            return Ok(profile); // Return the updated profile
        }

        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}
