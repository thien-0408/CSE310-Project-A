using backend.Entities.Notification;
using backend.Entities.User;
using backend.Models;

namespace backend.Services
{
    public interface IAdminService
    {
        Task<IEnumerable<UserListDto>> GetAllUsersAsync();
        Task<User?> CreateAccountAsync(AddUserDto newUser);
        Task<bool> ActivateUserAsync(string userName);
        Task<bool> DeactivateUserAsync(string userName);
        Task<bool> DeleteUserAsync(string userName);

        Task<DailyWord> AddOrUpdateDailyWordAsync(DailyWord request);
        Task<DailyTip> AddOrUpdateDailyTipAsync(DailyTip request);
    }
}
