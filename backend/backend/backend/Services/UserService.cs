using backend.Data;
using backend.Entities;
using backend.Entities.Notification;
using backend.Entities.User;
using backend.Models;
using backend.Models.ReadingDto;
using backend.Models.WritingDto; 
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class UserService : IUserService
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;

        public UserService(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }


        //Update profile 
        public async Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileDto request)
        {
            var profile = await _context.Profiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile == null) return null;

            if (request.Avatar != null)
            {
                var avatarUrl = await _fileService.UploadFile(request.Avatar, "user_avatars");
                profile.AvatarUrl = avatarUrl;
            }

            profile.Bio = request.Bio;
            profile.FullName = request.FullName;
            profile.TargetScore = request.TargetScore;
            profile.Email = request.Email;
            profile.PhoneNumber = request.PhoneNumber;
            profile.DateOfBirth = request.DateOfBirth;

            await _context.SaveChangesAsync();

            return new UserProfileDto
            {
                Id = userId,
                FullName = profile.FullName,
                Email = profile.Email,
                AvatarUrl = profile.AvatarUrl,
                Bio = profile.Bio,
                TargetScore = profile.TargetScore,
                PhoneNumber = profile.PhoneNumber,
                DateOfBirth = profile.DateOfBirth
            };
        }


        //Attempt test
        public async Task<TestAttemptResponseDto?> AttemptTestAsync(Guid userId, string testId)
        {
            var readingTest = await _context.ReadingTests.FindAsync(testId);
            if (readingTest != null)
            {
                var attempt = new ReadingTestResult
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    TestId = testId,
                    Skill = "Reading",
                    IsCompleted = false,
                    TakenDate = DateTime.UtcNow,
                    FinishDate = DateTime.UtcNow,
                    Title = readingTest.Title,
                    Score = 0
                };
                _context.ReadingTestResults.Add(attempt);
                await _context.SaveChangesAsync();
                return new TestAttemptResponseDto { Id = attempt.Id.ToString(), Skill = "Reading", Message = "Reading attempt started" };
            }

            var listeningTest = await _context.ListeningTests.FindAsync(testId);
            if (listeningTest != null)
            {
                var attempt = new ListeningTestResult
                {
                    Id = Guid.NewGuid().ToString(),
                    UserId = userId,
                    TestId = testId,
                    Skill = "Listening",
                    IsCompleted = false,
                    TakenDate = DateTime.UtcNow,
                    FinishDate = DateTime.UtcNow,
                    Title = listeningTest.Title,
                    Score = 0
                };
                _context.ListeningTestResults.Add(attempt);
                await _context.SaveChangesAsync();
                return new TestAttemptResponseDto { Id = attempt.Id, Skill = "Listening", Message = "Listening attempt started" };
            }

            if (Guid.TryParse(testId, out var writingTestId))
            {
                var writingTest = await _context.WritingTests.FindAsync(writingTestId.ToString()); 
                if (writingTest != null)
                {
                    var attempt = new WritingSubmission
                    {
                        Id = Guid.NewGuid().ToString(),
                        UserId = userId,
                        TestId = writingTestId.ToString(),
                        Content = "",
                        WordCount = 0,
                        SubmittedDate = DateTime.UtcNow,
                        Status = "Draft"
                    };
                    _context.WritingSubmissions.Add(attempt);
                    await _context.SaveChangesAsync();
                    return new TestAttemptResponseDto { Id = attempt.Id, Skill = "Writing", Message = "Writing attempt started" };
                }
            }

            return null;
        }


        //Submit test
        public async Task<object?> SubmitTestAsync(Guid userId, string resultId, double accuracy)
        {
            // Check Reading
            if (Guid.TryParse(resultId, out var parsedResultId))
            {
                var readingAttempt = await _context.ReadingTestResults
                    .FirstOrDefaultAsync(r => r.Id == parsedResultId && r.UserId == userId);

                if (readingAttempt != null)
                {
                    readingAttempt.Score = accuracy;
                    readingAttempt.IsCompleted = true;
                    readingAttempt.FinishDate = DateTime.UtcNow;
                    await _context.SaveChangesAsync();
                    return readingAttempt;
                }
            }

            // Check Listening
            var listeningAttempt = await _context.ListeningTestResults
                .FirstOrDefaultAsync(r => r.Id == resultId && r.UserId == userId);

            if (listeningAttempt != null)
            {
                listeningAttempt.Score = accuracy;
                listeningAttempt.IsCompleted = true;
                listeningAttempt.FinishDate = DateTime.UtcNow;
                await _context.SaveChangesAsync();
                return listeningAttempt;
            }

            return null;
        }


        //Drop the test
        public async Task<bool> DropTestAsync(Guid userId, string resultId)
        {
            if (Guid.TryParse(resultId, out var parsedResultId))
            {
                var readingAttempt = await _context.ReadingTestResults
                    .FirstOrDefaultAsync(r => r.Id == parsedResultId && r.UserId == userId);

                if (readingAttempt != null)
                {
                    _context.ReadingTestResults.Remove(readingAttempt);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }

            var listeningAttempt = await _context.ListeningTestResults
                .FirstOrDefaultAsync(r => r.Id == resultId && r.UserId == userId);

            if (listeningAttempt != null)
            {
                _context.ListeningTestResults.Remove(listeningAttempt);
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }


        //Get history test attempts
        public async Task<IEnumerable<GetResultDto>> GetTestHistoryAsync(Guid userId)
        {
            var readingList = await _context.ReadingTestResults
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .Select(r => new GetResultDto
                {
                    TestId = Guid.Parse(r.TestId),
                    Accuracy = r.Score,
                    IsCompleted = r.IsCompleted,
                    Skill = "Reading",
                    Title = r.Title,
                    TakenDate = r.TakenDate,
                    FinishDate = (DateTime)(r.FinishDate == DateTime.MinValue ? r.TakenDate : r.FinishDate)
                })
                .ToListAsync();

            var listeningList = await _context.ListeningTestResults
                .AsNoTracking()
                .Where(r => r.UserId == userId)
                .Select(r => new GetResultDto
                {
                    TestId = Guid.Parse(r.TestId),
                    Accuracy = r.Score,
                    IsCompleted = r.IsCompleted,
                    Skill = "Listening",
                    Title = r.Title,
                    TakenDate = r.TakenDate,
                    FinishDate = (DateTime)(r.FinishDate == DateTime.MinValue ? r.TakenDate : r.FinishDate)
                })
                .ToListAsync();

            var writingList = await _context.WritingSubmissions
                .AsNoTracking()
                .Include(s => s.WritingTest)
                .Include(s => s.Result)
                .Where(s => s.UserId == userId)
                .Select(s => new GetResultDto
                {
                    TestId = Guid.Parse(s.TestId),
                    Accuracy = s.Result != null ? s.Result.OverallScore : 0,
                    IsCompleted = s.Status != "Draft",
                    Skill = "Writing",
                    Title = s.WritingTest.Title,
                    TakenDate = s.SubmittedDate,
                    FinishDate = s.Result != null ? s.Result.GradedDate : s.SubmittedDate
                })
                .ToListAsync();

            return readingList
                .Concat(listeningList)
                .Concat(writingList)
                .OrderByDescending(r => r.TakenDate)
                .ToList();
        }

        //Get noti
        public async Task<IEnumerable<NotificationDto>> GetNotificationsAsync(Guid userId)
        {
            return await _context.WritingSubmissions
                .AsNoTracking()
                .Include(s => s.WritingTest)
                .Include(s => s.Result)
                .Where(s => s.UserId == userId && s.Status == "Graded")
                .OrderByDescending(s => s.Result.GradedDate)
                .Take(10)
                .Select(s => new NotificationDto
                {
                    SubmissionId = s.Id,
                    TestTitle = s.WritingTest.Title,
                    Score = s.Result.OverallScore,
                    GradedDate = s.Result.GradedDate,
                    IsRead = false
                })
                .ToListAsync();
        }

        public async Task<DailyWord?> GetDailyWordAsync()
        {
            return await _context.DailyWords.FirstOrDefaultAsync();
        }

        public async Task<DailyTip?> GetDailyTipAsync()
        {
            return await _context.DailyTips.FirstOrDefaultAsync();
        }
    }
}