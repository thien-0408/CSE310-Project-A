using backend.Models;

namespace backend.Services
{
    public interface ITestService
    {
        Task<IEnumerable<TestSummaryDto>> GetAllTestsAsync();
        Task<bool> DeleteTestAsync(Guid testId);
        Task<bool> ModifyTestAsync(string testId, ModifyTestDto request);
    }
}