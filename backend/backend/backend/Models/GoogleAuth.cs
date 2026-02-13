namespace backend.Models
{
    public class GoogleLoginRequest
    {
        public string IdToken { get; set; }
    }

    public class LoginResponse
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
    }
}
