using backend.Data;
using backend.Models;
using backend.Models.ReadingDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly UserDbContext _context;
        public TestController(UserDbContext context)
        {
            _context = context;
        }
        [HttpGet("fetch-tests")]
        public async Task<ActionResult<IEnumerable<TestSummaryDto>>> GetAllTests()
        {
            var readingQuery = _context.ReadingTests.Select(t => new TestSummaryDto
            {
                TestId = t.TestId,
                Title = t.Title,
                TestType = t.TestType,
                Skill = "reading", 
                ImageUrl = t.ImageUrl,
                SubTitle = t.Subtitle ?? "",
                Button = "Start Now",
                TestTaken = GetRandomNumber()
            });

            var listeningQuery = _context.ListeningTests.Select(t => new TestSummaryDto
            {
                TestId = t.TestId.ToString(),
                Title = t.Title,
                TestType = t.TestType,
                Skill = "listening",
                ImageUrl = t.ImageUrl,
                SubTitle = t.SubTitle ?? "",
                Button = "Try Now",
                TestTaken = 150000
            });

            var allTests = await readingQuery
                        .Concat(listeningQuery) 
                        .ToListAsync();
            return Ok(allTests);
        }
        private int GetRandomNumber()
        {
            Random random = new Random();
            return random.Next(1, 10000);
        }
    }
}
