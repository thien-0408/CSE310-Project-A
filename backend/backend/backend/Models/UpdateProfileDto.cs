using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UpdateProfileDto
    {
        public string? Bio { get; set; }
        public string FullName { get; set; } = string.Empty;
        public float? TargetScore { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Email { get; set; } = string.Empty;
        public IFormFile? Avatar { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6)] 
        public string NewPassword { get; set; } = string.Empty;
    }
}