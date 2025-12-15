using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ITestService _testService;

        public TestController(ITestService testService)
        {
            _testService = testService;
        }

        [HttpGet("fetch-tests")]
        public async Task<ActionResult<IEnumerable<TestSummaryDto>>> GetAllTests()
        {
            var allTests = await _testService.GetAllTestsAsync();
            return Ok(allTests);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-test/{testId}")]
        public async Task<ActionResult> DeleteTest(Guid testId)
        {
            var success = await _testService.DeleteTestAsync(testId);
            if (success)
            {
                return Ok("Test deleted successfully");
            }
            return NotFound("Test not found");
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("modify/{testId}")]
        public async Task<ActionResult> ModifyTitleAndCover(string testId, [FromForm] ModifyTestDto request) // Thêm [FromForm] vì có upload ảnh
        {
            var success = await _testService.ModifyTestAsync(testId, request);
            if (success)
            {
                return Ok("Test modified successfully");
            }
            return NotFound("Test not found");
        }
    }
}