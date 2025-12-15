using backend.Entities.Listening;
using backend.Models.ListeningDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/listening")]
    [ApiController]
    public class ListeningController : ControllerBase
    {
        private readonly IListeningService _listeningService;

        public ListeningController(IListeningService listeningService)
        {
            _listeningService = listeningService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("create-listening")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ListeningTest>> CreateListeningTest([FromForm] CreateListeningTestRequest request)
        {
            try
            {
                var createdTest = await _listeningService.CreateListeningTestAsync(request);
                return Ok(new
                {
                    Message = "Listening Test created successfully",
                    TestId = createdTest.Id
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, trace = ex.StackTrace });
            }
        }

        [HttpGet("get-test/{id}")]
        public async Task<ActionResult<ListeningTest>> GetListeningTest(string id)
        {
            var test = await _listeningService.GetListeningTestByIdAsync(id);

            if (test == null)
            {
                return NotFound(new { message = "Test not found" });
            }
            return Ok(test);
        }
    }
}