using backend.Data;
using backend.Entities.Notification;
using backend.Entities.User;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class AdminService : IAdminService
    {
        private readonly UserDbContext _context;

        public AdminService(UserDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<UserListDto>> GetAllUsersAsync()
        {
            return await _context.Users.Select(u => new UserListDto
            {
                Id = u.Id,
                UserName = u.UserName,
                UserRole = u.Role,
                IsActived = u.IsActive
            }).ToListAsync();
        }

        public async Task<User?> CreateAccountAsync(AddUserDto newUser)
        {
            if (await _context.Users.AnyAsync(u => u.UserName == newUser.UserName))
            {
                return null; 
            }

            var user = new User
            {
                Role = newUser.Role,
                UserName = newUser.UserName,
                IsActive = true 
            };

            // Hash password logic
            var hashedPassword = new PasswordHasher<User>().HashPassword(user, newUser.Password);
            user.PasswordHash = hashedPassword;

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<bool> ActivateUserAsync(string userName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user == null) return false;

            user.IsActive = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeactivateUserAsync(string userName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user == null) return false;

            user.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(string userName)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<DailyWord> AddOrUpdateDailyWordAsync(DailyWord request)
        {
            var existingWord = await _context.DailyWords.FirstOrDefaultAsync();

            if (existingWord == null)
            {
                var newWord = new DailyWord
                {
                    Id = Guid.NewGuid().ToString(),
                    Word = request.Word,
                    Phonetic = request.Phonetic,
                    Type = request.Type,
                    Definition = request.Definition,
                    Example = request.Example,
                };
                await _context.DailyWords.AddAsync(newWord);
                await _context.SaveChangesAsync();
                return newWord;
            }
            else
            {
                existingWord.Word = request.Word;
                existingWord.Phonetic = request.Phonetic;
                existingWord.Type = request.Type;
                existingWord.Definition = request.Definition;
                existingWord.Example = request.Example;
                _context.DailyWords.Update(existingWord);
                await _context.SaveChangesAsync();
                return existingWord;
            }
        }

        public async Task<DailyTip> AddOrUpdateDailyTipAsync(DailyTip request)
        {
            var existingTip = await _context.DailyTips.FirstOrDefaultAsync();

            if (existingTip == null)
            {
                var newTip = new DailyTip
                {
                    Id = Guid.NewGuid().ToString(),
                    Title = request.Title,
                    Content = request.Content,
                    Category = request.Category
                };
                await _context.DailyTips.AddAsync(newTip);
                await _context.SaveChangesAsync();
                return newTip;
            }
            else
            {
                existingTip.Title = request.Title;
                existingTip.Content = request.Content;
                existingTip.Category = request.Category;
                _context.DailyTips.Update(existingTip);
                await _context.SaveChangesAsync();
                return existingTip;
            }
        }
    }
}
