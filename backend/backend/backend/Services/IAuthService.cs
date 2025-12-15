using backend.Entities.User;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<UserProfileDto?> RegisterAsync(RegisterDto request);

        Task<TokenResponseDto?> LoginAsync(UserDto request);
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request);
        Task<UserProfileDto?> GetProfileAsync(Guid userId); 
        Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileDto request);
        Task<bool> LogoutAsync(Guid userId);
        Task<bool> ChangePasswordAsync(Guid userId, ChangePasswordDto requestDto);
    }
}
