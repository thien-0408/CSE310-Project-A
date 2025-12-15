using backend.Data;
using backend.Entities.User;
using backend.Entities.Writing;
using backend.Models.WritingDto;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class WritingService : IWritingService
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public WritingService(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }

        public async Task<WritingTest> CreateWritingTestAsync(CreateWritingTestDto request)
        {
            string imageUrl = string.Empty;
            if (request.Image != null)
            {
                imageUrl = await _fileService.UploadFile(request.Image, "writing_images");
            }

            var writingTest = new WritingTest
            {
                Id = Guid.NewGuid().ToString(),
                Title = request.Title,
                Subtitle = request.Subtitle,
                Topic = request.Topic,
                ImageUrl = imageUrl,
                Duration = request.Duration,
                TestType = request.TestType,
                Skill = request.Skill,
                CreatedAt = DateTime.UtcNow,
            };

            await _context.WritingTests.AddAsync(writingTest);
            await _context.SaveChangesAsync();
            return writingTest;
        }

        public async Task<WritingTest?> GetWritingTestByIdAsync(string id)
        {
            return await _context.WritingTests.FindAsync(id);
        }

        public async Task<WritingSubmission?> SubmitWritingTestAsync(Guid userId, SubmitWritingDto request)
        {
            var test = await _context.WritingTests.FindAsync(request.TestId);
            if (test == null)
            {
                return null;
            }

            var submission = new WritingSubmission
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                TestId = request.TestId,
                Content = request.Content,
                WordCount = request.WordCount,
                SubmittedDate = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.WritingSubmissions.Add(submission);
            await _context.SaveChangesAsync();
            return submission;
        }

        public async Task<IEnumerable<WritingSubmissionSummaryDto>> GetPendingSubmissionsAsync()
        {
            return await _context.WritingSubmissions
                .Include(s => s.User)
                    .ThenInclude(u => u.Profile) 
                .Include(s => s.WritingTest)
                .Where(s => s.Status == "Pending")
                .OrderByDescending(s => s.SubmittedDate)
                .Select(s => new WritingSubmissionSummaryDto
                {
                    SubmissionId = s.Id,
                    TestTitle = s.WritingTest.Title,
                    UserName = s.User.UserName,
                    UserEmail = s.User.Profile != null ? s.User.Profile.Email : "",
                    SubmittedDate = s.SubmittedDate,
                    Status = s.Status,
                    ImageUrl = s.User.Profile != null ? (s.User.Profile.AvatarUrl ?? "") : ""
                })
                .ToListAsync();
        }

        public async Task<WritingSubmissionDetailDto?> GetSubmissionDetailAsync(Guid submissionId)
        {
            var submission = await _context.WritingSubmissions
                .Include(s => s.WritingTest)
                .Include(s => s.User)
                .Include(s => s.Result)
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Id == submissionId.ToString());

            if (submission == null) return null;

            return new WritingSubmissionDetailDto
            {
                Id = submission.Id,
                TestTitle = submission.WritingTest.Title,
                Topic = submission.WritingTest.Topic,
                TestImage = submission.WritingTest.ImageUrl,
                StudentName = submission.User.UserName,
                Content = submission.Content,
                WordCount = submission.WordCount,
                SubmittedDate = submission.SubmittedDate,
                HasResult = submission.Result != null,
                OverallScore = submission.Result?.OverallScore ?? 0,
                GeneralFeedback = submission.Result?.GeneralFeedback,
                GrammarFeedback = submission.Result?.GrammarFeedback,
                VocabularyFeedback = submission.Result?.VocabularyFeedback,
                GradedDate = submission.Result?.GradedDate
            };
        }

        public async Task<WritingResult?> GradeSubmissionAsync(GradeWritingSubmissionDto request)
        {
            var submission = await _context.WritingSubmissions
                .FirstOrDefaultAsync(s => s.Id == request.SubmissionId);

            if (submission == null) return null; // Not Found

            if (submission.Status == "Graded")
                throw new InvalidOperationException("This submission has already been graded.");

            var result = new WritingResult
            {
                Id = Guid.NewGuid().ToString(),
                SubmissionId = request.SubmissionId,
                TaskResponseScore = request.TaskResponse,
                CoherenceCohesionScore = request.CoherenceCohesion,
                LexicalResourceScore = request.LexicalResource,
                GrammaticalRangeAccuracyScore = request.GrammaticalRange,
                OverallScore = request.OverallScore,
                GeneralFeedback = request.GeneralFeedback,
                GrammarFeedback = request.GrammerFeedback,
                VocabularyFeedback = request.VocabularyFeedback,
                GradedDate = DateTime.UtcNow,
            };

            submission.Status = "Graded";

            // Transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                _context.WritingResults.Add(result);
                _context.WritingSubmissions.Update(submission);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return result;
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task<bool> DeleteSubmissionAsync(string id)
        {
            var submission = await _context.WritingSubmissions.FindAsync(id);
            if (submission is null)
            {
                return false;
            }
            _context.WritingSubmissions.Remove(submission);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}