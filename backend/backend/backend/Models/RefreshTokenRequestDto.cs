namespace backend.Models
{
    public class RefreshTokenRequestDto
    {
        public Guid UserId { get; set; }
        public required string RefreshToken { get; set; }
        public required string AccessToken { get; set; }
    }
}
