using backend.Data;
using backend.Models;
using backend.Models.ReadingDto;
using backend.Services;
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
        private readonly IFileService _fileService;
        public TestController(UserDbContext context, IFileService service)
        {
            _context = context;
            _fileService = service;
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

            var writingQuery = _context.WritingTests.Select(t => new TestSummaryDto
            {
                TestId = t.Id,
                Title = t.Title,
                TestType = t.TestType,
                Skill = "writing",
                ImageUrl = t.ImageUrl ?? "",
                SubTitle = t.Subtitle ?? "",
                Button = "Start Now",
                TestTaken = GetRandomNumber()
            });

            var listeningQuery = _context.ListeningTests.Select(t => new TestSummaryDto
            {
                TestId = t.Id.ToString(),
                Title = t.Title,
                TestType = t.TestType,
                Skill = "listening",
                ImageUrl = t.ImageUrl,
                SubTitle = t.SubTitle ?? "",
                Button = "Try Now",
                TestTaken = GetRandomNumber(),
            });

            var allTests = await readingQuery
                        .Concat(writingQuery).Concat(listeningQuery) 
                        .ToListAsync();
            return Ok(allTests);
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-test/{testId}")]
        public async Task<ActionResult> DeleteTest(Guid testId)
        {
            var readingTest = await _context.ReadingTests.FindAsync(testId.ToString());
            if (readingTest != null)
            {
                _context.ReadingTests.Remove(readingTest);
                await _context.SaveChangesAsync();
                return Ok("Reading test deleted successfully");
            }
            var writingTest = await _context.WritingTests.FindAsync(testId.ToString());
            if (writingTest != null)
            {
                _context.WritingTests.Remove(writingTest);
                await _context.SaveChangesAsync();
                return Ok("Writing test deleted successfully");
            }
            var listeningTest = await _context.ListeningTests.FindAsync(testId.ToString());
            if (listeningTest != null)
            {
                _context.ListeningTests.Remove(listeningTest);
                await _context.SaveChangesAsync();
                return Ok("Listening test deleted successfully");
            }
            return NotFound("Test not found");
        }
        [Authorize(Roles = "Admin")]
        [HttpPatch("modify/{testId}")]
        public async Task<ActionResult<TestSummaryDto>> ModifyTitleAndCover(string testId, ModifyTestDto request)
        {
            var readingTest = await _context.ReadingTests.FindAsync(testId);
            if(readingTest != null)
            {
                readingTest.Title = request.Title;
                if(request.CoverImage != null)
                {
                    _fileService.DeleteFile(readingTest.ImageUrl);
                    var newImageUrl = _fileService.UploadFile(request.CoverImage, "reading_images");
                    readingTest.ImageUrl = await newImageUrl;
                }
            }

            var listeningTest = await _context.ListeningTests.FindAsync(testId);
            if (listeningTest != null)
            {
                listeningTest.Title = request.Title;
                if(request.CoverImage != null)
                {
                    _fileService.DeleteFile(listeningTest.ImageUrl);
                    var newImageUrl = _fileService.UploadFile(request.CoverImage, "listening_images");
                    listeningTest.ImageUrl = await newImageUrl;
                }
            }

            var writingTest = await _context.WritingTests.FindAsync(testId);
            if (writingTest != null)
            {
                writingTest.Title = request.Title;
                if (request.CoverImage != null)
                {
                    _fileService.DeleteFile(writingTest.ImageUrl);
                    var newImageUrl = _fileService.UploadFile(request.CoverImage, "writing_images");
                    writingTest.ImageUrl = await newImageUrl;
                }
            }
            return Ok();
        }
        private int GetRandomNumber()
        {
            Random random = new Random();
            return random.Next(1, 10000);
        }
    }
}
