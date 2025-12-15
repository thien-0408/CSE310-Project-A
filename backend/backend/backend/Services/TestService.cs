using backend.Data;
using backend.Models;
using backend.Models.ReadingDto; 
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class TestService : ITestService
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;
        private readonly Random _random;

        public TestService(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
            _random = new Random();
        }

        public async Task<IEnumerable<TestSummaryDto>> GetAllTestsAsync()
        {
            var readingTests = await _context.ReadingTests.AsNoTracking().ToListAsync();
            var writingTests = await _context.WritingTests.AsNoTracking().ToListAsync();
            var listeningTests = await _context.ListeningTests.AsNoTracking().ToListAsync();

            var readingDtos = readingTests.Select(t => new TestSummaryDto
            {
                TestId = t.TestId,
                Title = t.Title,
                TestType = t.TestType,
                Skill = "reading",
                ImageUrl = t.ImageUrl,
                SubTitle = t.Subtitle ?? "",
                Button = "Start Now",
                TestTaken = _random.Next(1, 10000)
            });

            var writingDtos = writingTests.Select(t => new TestSummaryDto
            {
                TestId = t.Id,
                Title = t.Title,
                TestType = t.TestType,
                Skill = "writing",
                ImageUrl = t.ImageUrl ?? "",
                SubTitle = t.Subtitle ?? "",
                Button = "Start Now",
                TestTaken = _random.Next(1, 10000)
            });

            var listeningDtos = listeningTests.Select(t => new TestSummaryDto
            {
                TestId = t.Id.ToString(),
                Title = t.Title,
                TestType = t.TestType,
                Skill = "listening",
                ImageUrl = t.ImageUrl,
                SubTitle = t.SubTitle ?? "",
                Button = "Try Now",
                TestTaken = _random.Next(1, 10000)
            });

            return readingDtos.Concat(writingDtos).Concat(listeningDtos);
        }

        public async Task<bool> DeleteTestAsync(Guid testId)
        {
            var idStr = testId.ToString();

            var readingTest = await _context.ReadingTests.FindAsync(idStr);
            if (readingTest != null)
            {
                _fileService.DeleteFile(readingTest.ImageUrl);
                _context.ReadingTests.Remove(readingTest);
                await _context.SaveChangesAsync();
                return true;
            }

            var writingTest = await _context.WritingTests.FindAsync(idStr);
            if (writingTest != null)
            {
                _context.WritingTests.Remove(writingTest);
                await _context.SaveChangesAsync();
                return true;
            }

            var listeningTest = await _context.ListeningTests.FindAsync(idStr);
            if (listeningTest != null)
            {
                _context.ListeningTests.Remove(listeningTest);
                await _context.SaveChangesAsync();
                return true;
            }

            return false; // 404
        }

        public async Task<bool> ModifyTestAsync(string testId, ModifyTestDto request)
        {
            // 1. Reading
            var readingTest = await _context.ReadingTests.FindAsync(testId);
            if (readingTest != null)
            {
                readingTest.Title = request.Title;
                if (request.CoverImage != null)
                {
                    if (!string.IsNullOrEmpty(readingTest.ImageUrl))
                        _fileService.DeleteFile(readingTest.ImageUrl);

                    readingTest.ImageUrl = await _fileService.UploadFile(request.CoverImage, "reading_images");
                }
                await _context.SaveChangesAsync();
                return true;
            }

            // 2. Listening
            var listeningTest = await _context.ListeningTests.FindAsync(testId);
            if (listeningTest != null)
            {
                listeningTest.Title = request.Title;
                if (request.CoverImage != null)
                {
                    if (!string.IsNullOrEmpty(listeningTest.ImageUrl))
                        _fileService.DeleteFile(listeningTest.ImageUrl);

                    listeningTest.ImageUrl = await _fileService.UploadFile(request.CoverImage, "listening_images");
                }
                await _context.SaveChangesAsync();
                return true;
            }

            // 3. Writing
            var writingTest = await _context.WritingTests.FindAsync(testId);
            if (writingTest != null)
            {
                writingTest.Title = request.Title;
                if (request.CoverImage != null)
                {
                    if (!string.IsNullOrEmpty(writingTest.ImageUrl))
                        _fileService.DeleteFile(writingTest.ImageUrl);

                    writingTest.ImageUrl = await _fileService.UploadFile(request.CoverImage, "writing_images");
                }
                await _context.SaveChangesAsync();
                return true;
            }

            return false; // 404
        }
    }
}