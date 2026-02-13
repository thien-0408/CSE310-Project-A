using backend.Models.SpeakingDto;
using backend.Entities.Speaking;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/speaking")]
    public class SpeakingController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly GeminiService _geminiService;

        public SpeakingController(IFileService fileService, GeminiService geminiService)
        {
            _fileService = fileService;
            _geminiService = geminiService;
        }

        [HttpPost("test-upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> TestUpload([FromForm] SpeakingCreateDto dto)
        {
            var audioPath = await _fileService.UploadFile(
                dto.Audio,
                "uploads/speaking"
            );

            var speaking = new Speaking
            {
                Question = dto.Question,
                AudioPath = audioPath,
                Transcript = null,
                Score = null
            };

            return Ok(new
            {
                message = "File uploaded",
                data = speaking
            });
        }


        //Use gemini 
        [HttpPost("convert-file")]
        public async Task<IActionResult> UploadSpeakingTest(IFormFile audio, string question)
        {
            if (audio == null || audio.Length == 0)
                return BadRequest("No audio file provided.");

            try
            {
                using var memoryStream = new MemoryStream();
                await audio.CopyToAsync(memoryStream);
                var audioBytes = memoryStream.ToArray();

                
                var prompt = $@"
                You are an IELTS examiner. 
                Task 1: Transcribe the following audio exactly mostly word for word.
                Task 2: Evaluate the answer based on the question: '{question}'.
                
                Format the output as JSON:
                {{
                    ""transcript"": ""..."",
                    ""score"": 7.5,
                    ""feedback"": ""...""
                }}
            ";

                var result = await _geminiService.AnalyzeAudioAsync(audioBytes, prompt);

                return Ok(new { raw_result = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("get-models")]
        public async Task<IActionResult> GetModels()
        {
            try
            {
                var models = await _geminiService.GetGenerateContentModels();
                return Ok(new { models });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
