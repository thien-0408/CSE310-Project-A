using backend.Entities.Listening;
using backend.Models.ListeningDto;

namespace backend.Services
{
    public interface IListeningService
    {
        Task<ListeningTest> CreateListeningTestAsync(CreateListeningTestRequest request);
        Task<ListeningTest?> GetListeningTestByIdAsync(string id);
    }
}
