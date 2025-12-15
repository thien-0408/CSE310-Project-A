namespace backend.Models
{
    public class UserProfileDto
    {
        public Guid Id { get; set; } 
        public string UserName { get; set; } = string.Empty; 
        public string Role { get; set; } = string.Empty; 

        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public float? TargetScore { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public IFormFile? Avatar { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
