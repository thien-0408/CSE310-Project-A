using backend.Models.SpeakingDto;
using backend.Entities.Speaking;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SpeakingController : ControllerBase
    {
        private readonly IFileService _fileService;

        public SpeakingController(IFileService fileService)
        {
            _fileService = fileService;
        }

        /// <summary>
        /// TEST: Nhận audio + question, upload file
        /// </summary>
        [HttpPost("test-upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> TestUpload([FromForm] SpeakingCreateDto dto)
        {
            // 1. Upload audio
            var audioPath = await _fileService.UploadFile(
                dto.Audio,
                "uploads/speaking"
            );

            // 2. Fake entity (chưa cần DB)
            var speaking = new Speaking
            {
                Question = dto.Question,
                AudioPath = audioPath,
                Transcript = null,
                Score = null
            };

            return Ok(new
            {
                message = "Upload audio thành công",
                data = speaking
            });
        }
    }
}
