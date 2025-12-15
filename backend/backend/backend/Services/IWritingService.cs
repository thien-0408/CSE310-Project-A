using backend.Entities.User;
using backend.Entities.Writing;
using backend.Models.WritingDto;

namespace backend.Services
{
    public interface IWritingService
    {
        // Test Management
        Task<WritingTest> CreateWritingTestAsync(CreateWritingTestDto request);
        Task<WritingTest?> GetWritingTestByIdAsync(string id);

        // Submission Logic
        Task<WritingSubmission?> SubmitWritingTestAsync(Guid userId, SubmitWritingDto request);
        Task<IEnumerable<WritingSubmissionSummaryDto>> GetPendingSubmissionsAsync();
        Task<WritingSubmissionDetailDto?> GetSubmissionDetailAsync(Guid submissionId);

        // Grading Logic
        Task<WritingResult?> GradeSubmissionAsync(GradeWritingSubmissionDto request);

        // Delete
        Task<bool> DeleteSubmissionAsync(string id);
    }
}