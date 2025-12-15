using backend.Entities.Reading;
using backend.Models.ReadingDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/reading-test")]
    [ApiController]
    public class ReadingTestController : ControllerBase
    {
        private readonly IReadingService _readingService;

        public ReadingTestController(IReadingService readingService)
        {
            _readingService = readingService;
        }

        [HttpPost("add-reading-test")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ReadingTest>> AddReadingTest([FromForm] CreateReadingTestDto request)
        {
            try
            {
                var createdTest = await _readingService.CreateReadingTestAsync(request);
                return Ok(new { message = "Test Created Successfully", testId = createdTest.TestId });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Server Error", error = ex.Message, stack = ex.StackTrace });
            }
        }

        [HttpGet("get-all")]
        public async Task<ActionResult<IEnumerable<ReadingTest>>> GetAllReadingTests()
        {
            var tests = await _readingService.GetAllReadingTestsAsync();
            return Ok(tests);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ReadingTest>> GetTestById(Guid id)
        {
            var test = await _readingService.GetReadingTestByIdAsync(id);

            if (test == null)
            {
                return NotFound(new { message = "Not found" });
            }
            return Ok(test);
        }
    }
}