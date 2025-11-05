using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class AddUserDto
    {
        [Required]
        public string UserName { get; set; } = string.Empty;
        [Required]
        public string Password { get; set; } = string.Empty;
        [Required]
        public string Role {  get; set; } = string.Empty;
    }
}
