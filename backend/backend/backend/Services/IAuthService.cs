using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<User?> RegisterAsync(RegisterDto request);
        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request);

        Task<UserProfileDto?> GetProfileAsync(Guid userId);
        Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileDto request);
        Task<bool> LogoutAsync(Guid userId);
    }
}
