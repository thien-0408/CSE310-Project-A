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
    }
}
