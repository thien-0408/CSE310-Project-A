namespace backend.Entities.User
{
    public class User
    {
        public Guid Id {  get; set; }
        public string UserName { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? RefreshToken { get; set; }
        public DateTime? RefreshExpireTime { get; set; }
        public Profile Profile { get; set; } = null!; //User's profile
        public bool IsActive { get; set; } = true;
        public virtual ICollection<ReadingTestResult> Results { get; set; } = new List<ReadingTestResult>();
        public virtual ICollection<ListeningTestResult> ListeningResults { get; set; } = new List<ListeningTestResult>();
    }
}
