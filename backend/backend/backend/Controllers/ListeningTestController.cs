using backend.Data;
using backend.Entities;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/listening-test")]
    [ApiController]
    public class ListeningTestController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public ListeningTestController(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }
        [Authorize(Roles = "Admin")]
        [HttpPost("upload-json-test")]
        public async Task<ActionResult<ListeningTest>> UploadJson([FromForm]UploadJsonTestDto dto)
        {
            if (dto.JsonFile == null) 
            {
                return BadRequest("File is required");
            }
            var jsonUrl = await _fileService.UploadFile(dto.JsonFile, "listening-json");
            var test = new ListeningTest
            {
                Title = dto.title,
                TestType = dto.testType,
                Skill = "listening",
                AudioDuration = dto.audioDuration,
                JsonFileUrl = jsonUrl
            };
            await _context.ListeningTests.AddAsync(test);
            await _context.SaveChangesAsync();
            return Ok(test);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ListeningTest>>> GetAllTest()
        {
            var dataList = await _context.ListeningTests.Select(t => new GetListeningTestDto
            {
                testId = t.TestId,
                title = t.Title,
                testType = t.TestType,
                skill = t.Skill,
                audioDuration = t.AudioDuration,
                imageUrl = t.ImageUrl,
                audioUrl = t.AudioUrl,
                fileUrl = t.JsonFileUrl
            }).ToListAsync();
            return Ok(dataList);
        }
        
    }
}
