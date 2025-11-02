using backend.Data;
using backend.Entities;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services
{
    public class AuthService(UserDbContext context, IConfiguration configuration) : IAuthService
    {
        //Register
        public async Task<User?> RegisterAsync(RegisterDto request)
        {
            if (await context.Users.AnyAsync(u => u.UserName == request.UserName))
            {
                return null;
            }
            

            var user = new User
            {
                Role = "User",
                UserName = request.UserName,
            };
            var HashedPassword = new PasswordHasher<User>().HashPassword(user, request.Password);
            user.PasswordHash = HashedPassword;

            var profile = new Profile
            {
                FullName = request.FullName,
                Email = request.Email,
                User = user
            };
         

            
            context.Users.Add(user); //add to db
            await context.Profiles.AddAsync(profile);
            await context.SaveChangesAsync();
            return user;
        }
        public async Task<TokenResponseDto?> LoginAsync(UserDto request)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == request.UserName);

            if (user is null)
            {
                return null;
            }
            if (new PasswordHasher<User>().VerifyHashedPassword(user, user.PasswordHash, request.Password)
                == PasswordVerificationResult.Failed)
            {
                return null;
            }
            return await CreateTokenResponse(user);
        }

        private async Task<TokenResponseDto> CreateTokenResponse(User user)
        {
            return new TokenResponseDto
            {
                AccessToken = CreateToken(user),
                RefreshToken = await GenerateAndRefreshToken(user),
            };
        }
        public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenRequestDto request)
        {
            var user = await ValidateRefreshTokenAsync(request.UserId, request.RefreshToken);
            if(user is null) { return null; }
            return await CreateTokenResponse(user);
        }
        private async Task<User?> ValidateRefreshTokenAsync(Guid userId, string refeshToken)
        {
            var user = await context.Users.FindAsync(userId);
            if(user is null || user.RefreshToken != refeshToken ||
                user.RefreshExpireTime <  DateTime.UtcNow)
            {
                return null;
            }
            return user;
        }
        private string GenerateRefreshToken()
        {
            var RandomNumber = new byte[64];
            using var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(RandomNumber);
            return Convert.ToBase64String(RandomNumber);
        }
        private async Task<string> GenerateAndRefreshToken(User user)
        {
            var refreshToken = GenerateRefreshToken();
            user.RefreshToken = refreshToken;
            user.RefreshExpireTime = DateTime.UtcNow.AddDays(1);
            await context.SaveChangesAsync();
            return refreshToken;
        }
        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role)

            };
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration.GetValue<string>("Appsettings:Token")!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var tokenDescriptor = new JwtSecurityToken(
                issuer: configuration.GetValue<string>("AppSettings:Issuer"),
                audience: configuration.GetValue<string>("AppSettings:Audience"),
                claims: claims,
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
        public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
        {
            var user = await context.Users
                .Include(u => u.Profile) // RẤT QUAN TRỌNG: tải Profile cùng lúc
                .AsNoTracking() // Không cần theo dõi thay đổi (read-only)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user is null || user.Profile is null)
            {
                return null;
            }

            // Map sang DTO
            return new UserProfileDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Role = user.Role,
                FullName = user.Profile.FullName,
                Email = user.Profile.Email,
                Bio = user.Profile.Bio,
                TargetScore = user.Profile.TargetScore,
                PhoneNumber = user.Profile.PhoneNumber,
                DateOfBirth = user.Profile.DateOfBirth
            };
        }

        public async Task<UserProfileDto?> UpdateProfileAsync(Guid userId, UpdateProfileDto request)
        {
            var profile = await context.Profiles
                             .FirstOrDefaultAsync(p => p.UserId == userId);
            if (profile is null)
            {
                return null; // Not found 
            }

            // Update
            profile.FullName = request.FullName;
            profile.Email = request.Email;
            profile.Bio = request.Bio;
            profile.TargetScore = request.TargetScore;
            profile.PhoneNumber = request.PhoneNumber;
            profile.DateOfBirth = request.DateOfBirth;

            await context.SaveChangesAsync();

            // return DTO
            return await GetProfileAsync(userId);
        }

        public async Task<bool> LogoutAsync(Guid userId)
        {
            var user = await context.Users.FindAsync(userId);
            if(user is null) { return false; }
            user.RefreshToken = null;
            user.RefreshExpireTime = null;
            await context.SaveChangesAsync();
            return true;
        }

       
    }
}
