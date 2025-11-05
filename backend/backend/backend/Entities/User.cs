namespace backend.Entities
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
    }
}
