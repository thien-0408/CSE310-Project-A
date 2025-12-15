using backend.Entities.User;
using backend.Entities.Writing;
using backend.Models.WritingDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/writing-test")]
    [ApiController]
    public class WritingTestController : ControllerBase
    {
        private readonly IWritingService _writingService;

        public WritingTestController(IWritingService writingService)
        {
            _writingService = writingService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<ActionResult<WritingTest>> CreateWritingTest([FromForm] CreateWritingTestDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var result = await _writingService.CreateWritingTestAsync(request);
            return Ok(result);
        }

        [HttpGet("get-test/{id}")]
        public async Task<ActionResult<WritingTest>> GetWritingTestById(string id)
        {
            var test = await _writingService.GetWritingTestByIdAsync(id);
            if (test == null) return NotFound();
            return Ok(test);
        }

        [Authorize]
        [HttpPost("submit")]
        public async Task<ActionResult<WritingSubmission>> SubmitWritingTest([FromBody] SubmitWritingDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var submission = await _writingService.SubmitWritingTestAsync(userId, request);

            if (submission == null)
            {
                return NotFound("Writing Test not found");
            }

            return Ok(new { message = "Submitted successfully", submissionId = submission.Id });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<WritingSubmissionSummaryDto>>> GetPendingSubmissions()
        {
            var submissions = await _writingService.GetPendingSubmissionsAsync();
            return Ok(submissions);
        }

        [Authorize]
        [HttpGet("user-submission/{id}")]
        public async Task<ActionResult> GetSubmissionDetail(Guid id)
        {
            var submission = await _writingService.GetSubmissionDetailAsync(id);
            if (submission == null) return NotFound();
            return Ok(submission);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("grade")]
        public async Task<ActionResult> GradeSubmission([FromBody] GradeWritingSubmissionDto request)
        {
            try
            {
                var result = await _writingService.GradeSubmissionAsync(request);

                if (result == null)
                    return NotFound("Submission not found");

                return Ok(new { message = "Grading saved successfully", resultId = result.Id });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error saving grading result: " + ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete/submission/{id}")]
        public async Task<ActionResult> DeleteSubmission(string id)
        {
            var success = await _writingService.DeleteSubmissionAsync(id);
            if (!success)
            {
                return NotFound();
            }
            return Ok("Submission removed");
        }

        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}