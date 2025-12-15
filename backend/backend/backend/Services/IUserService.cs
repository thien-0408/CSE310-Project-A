using backend.Entities;
using backend.Entities.Notification;
using backend.Models;
using backend.Models.ReadingDto;
using backend.Models.WritingDto;

namespace backend.Services
{
    public interface IUserService
    {
        // Profile
        Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileDto request);

        // Test Logic
        Task<TestAttemptResponseDto?> AttemptTestAsync(Guid userId, string testId);
        Task<object?> SubmitTestAsync(Guid userId, string resultId, double accuracy);
        Task<bool> DropTestAsync(Guid userId, string resultId);

        // History & Stats
        Task<IEnumerable<GetResultDto>> GetTestHistoryAsync(Guid userId);
        Task<IEnumerable<NotificationDto>> GetNotificationsAsync(Guid userId);

        // Daily Content
        Task<DailyWord?> GetDailyWordAsync();
        Task<DailyTip?> GetDailyTipAsync();
    }

    public class TestAttemptResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Skill { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}