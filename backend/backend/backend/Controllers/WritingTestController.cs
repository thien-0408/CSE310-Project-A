using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/writing-test")]
    [ApiController]
    public class WritingTestController : ControllerBase
    {
        private readonly UserDbContext _context;
        private readonly IFileService _fileService;
        public WritingTestController(UserDbContext context, IFileService fileService)
        {
            _context = context;
            _fileService = fileService;
        }
        private Guid GetUserIdFromToken()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            Guid.TryParse(userIdString, out var userId);
            return userId;
        }
    }
}
