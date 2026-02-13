using backend.Data;
using backend.Entities.User;
using backend.Models;
using backend.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


namespace backend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly UserDbContext context;
        private readonly IUserService _userService;
        private readonly IAuthService authService;
        public AuthController(UserDbContext _context, IAuthService sv, IConfiguration configuration, IUserService userService)
        {
            context = _context;
            authService = sv;
            _userService = userService;
            _configuration = configuration;
        }


        // Register
        [HttpPost("register")]
        public async Task<ActionResult<UserProfileDto>> Register(RegisterDto request)
        {
            var result = await authService.RegisterAsync(request);

            if (result == null)
            {
                return BadRequest("User Already Exist!");
            }

            return Ok(result);
        }

        //Login 
        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserDto request)
        {
            var token = await authService.LoginAsync(request);

            if (token is null)
            {
                return BadRequest("Invalid Username or Password or Account has been banned");
            }
            return Ok(token);
        }


        [HttpPost("refresh-token")]
        public async Task<ActionResult<TokenResponseDto>> RefreshToken(RefreshTokenRequestDto request)
        {
            var result = await authService.RefreshTokenAsync(request);
            if (result is null || request.AccessToken is null || result.RefreshToken is null)
            {
                return Unauthorized("Invalid Token!");
            }
            return Ok(result);
        }

        //Get profile
        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserProfileDto>> GetMyProfile()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty) return Unauthorized();

            var profile = await authService.GetProfileAsync(userId);
            if (profile is null) return NotFound();

            return Ok(profile);
        }


        //Logout API
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }
            await authService.LogoutAsync(userId);
            return Ok("Logged out successfully");
        }


        //Change pass
        [Authorize]
        [HttpPatch("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto request)
        {
            var userId = GetUserIdFromToken();
            if (userId == Guid.Empty)
            {
                return Unauthorized();
            }
            var success = await authService.ChangePasswordAsync(userId, request);
            if (success)
            {
                return Ok("Password changed successfully");
            }
            return BadRequest("Invalid current password");
        }
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
        //User authentication
        [Authorize]
        [HttpGet]
        public IActionResult AuthenticationEndPoint()
        {
            return Ok("You're authenticated");
        }

        //Google auth
        [HttpPost("signin-google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest request)
        {
            try
            {
                // 1. Validate Token Google
                var settings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string> { _configuration["Google:ClientId"] },
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

                var email = payload.Email;
                var name = payload.Name;

                // 2. Tìm user trong DB (Include Profile để check chuẩn)
                var user = await context.Users.Include(u => u.Profile)
                                              .FirstOrDefaultAsync(u => u.Profile.Email == email);

                // 3. Nếu chưa có thì tạo mới
                if (user == null)
                {
                    // --- FIX LỖI 1: Tạo ID trước, không gọi user.Id ---
                    var newUserId = Guid.NewGuid();

                    Profile profile = new Profile
                    {
                        Id = Guid.NewGuid(),
                        Bio = "",
                        FullName = name,
                        Email = email,
                        UserId = newUserId, // Dùng biến ID vừa tạo
                    };

                    user = new User
                    {
                        Id = newUserId, // Gán ID vào đây
                        UserName = email, // Username nên là email để đảm bảo unique
                        Role = "User",
                        IsActive = true,
                        Profile = profile
                    };

                    // --- FIX LỖI 2: Chỉ Add và Save khi là user MỚI ---
                    context.Users.Add(user);
                    await context.SaveChangesAsync();
                }

                // 4. Tạo Token (Truyền đúng UserId của user vừa tìm thấy/tạo mới)
                // Lưu ý: Tôi đã sửa hàm GenerateJwtToken để nhận userId
                var token = GenerateJwtToken(email, name, user.Id);

                return Ok(new LoginResponse
                {
                    Token = token,
                    Email = email,
                    Name = name
                });
            }
            catch (InvalidJwtException ex)
            {
                return BadRequest(new { message = "Token Google không hợp lệ.", error = ex.Message });
            }
            catch (Exception ex)
            {
                // Log lỗi ra console để debug
                Console.WriteLine($"Error: {ex.ToString()}");
                return StatusCode(500, new { message = "Lỗi server nội bộ", error = ex.Message });
            }
        }

        // --- CẬP NHẬT HÀM GenerateJwtToken ---
        // Thêm tham số Guid userId để Token chứa ID đúng của user trong DB
        private string GenerateJwtToken(string email, string name, Guid userId)
        {
            var jwtSettings = _configuration.GetSection("AppSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Token"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Name, name),
            // FIX LỖI 3: Dùng userId thực tế từ DB, KHÔNG dùng Guid.NewGuid() ngẫu nhiên
            // Nếu dùng Guid.NewGuid() ở đây, hàm GetProfile sẽ không bao giờ tìm thấy user.
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Role, "User"),
        }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"]
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
