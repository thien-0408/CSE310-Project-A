using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities
{
    public class Profile
    {
        public Guid Id { get; set; } // FK for profile
        public string? Bio { get; set; }
        public string FullName { get; set; } = string.Empty; // Not null
        public float? TargetScore { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public Guid UserId { get; set; } // FK
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public string? AvatarUrl { get; set; }
    }
}
