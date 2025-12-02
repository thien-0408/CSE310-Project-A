using backend.Data;
using backend.Entities.User;
using backend.Entities.Writing;
using backend.Models.WritingDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/writing-test")]
    [ApiController]
    public class WritingTestController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;
        public WritingTestController(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
       public async Task<ActionResult<WritingTest>> CreateWritingTest([FromForm] CreateWritingTestDto request)
        {
            var user = GetUserIdFromToken();
            if (user == Guid.Empty) return Unauthorized();

            string imageUrl = string.Empty;
            if(request.Image != null)
            {
                imageUrl = await _fileService.UploadFile(request.Image, "writing_images");
            }
            var writingTest = new WritingTest
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title,
                Subtitle = request.Subtitle,
                Topic = request.Topic,
                ImageUrl = imageUrl,
                Duration = request.Duration,
                TestType = request.TestType,
                Skill = request.Skill,
                CreatedAt = DateTime.UtcNow,
            };
            await _context.WritingTests.AddAsync(writingTest);
            await _context.SaveChangesAsync();
            return Ok(writingTest);
        }
        [HttpGet("get-tests/{id}")]
        public async Task<ActionResult<WritingTest>> GetWritingTestById(string id)
        {
            var test = await _context.WritingTests.FindAsync(id);
            if (test == null) return NotFound();
            return Ok(test);
        }
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}
