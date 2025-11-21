using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/milestone")]
    [ApiController]
    public class MilestoneController : ControllerBase
    {
        private readonly UserDbContext _context;
        public MilestoneController(UserDbContext context)
        {
            _context = context;
        }
        [Authorize]
        [HttpPost("generate-event")]
        public async Task<ActionResult<MilesonteDto>> CreateEvent(MilesonteDto eventDto)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }
            var mileStone = new MileStone
            {
                Date = eventDto.Date,
                EventTitle = eventDto.Title,
                EventDetail = eventDto.Description,
                UserId = userId
            };
            await _context.MileStones.AddAsync(mileStone);
            await _context.SaveChangesAsync();
            return Ok(mileStone);
        }
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}
