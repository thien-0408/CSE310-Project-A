using backend.Entities.Reading;
using backend.Models.ReadingDto;

namespace backend.Services
{
    public interface IReadingService
    {
        Task<ReadingTest> CreateReadingTestAsync(CreateReadingTestDto request);
        Task<IEnumerable<ReadingTest>> GetAllReadingTestsAsync();
        Task<ReadingTest?> GetReadingTestByIdAsync(Guid id);
    }
}