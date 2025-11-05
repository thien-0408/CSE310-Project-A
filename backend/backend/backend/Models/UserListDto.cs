namespace backend.Models
{
    public class UserListDto
    {
        public Guid Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string UserRole { get; set; } = string.Empty;
        public bool IsActived { get; set; }

    }
}
