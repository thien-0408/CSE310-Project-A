using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class MilesonteDto
    {
        [Required]
        public string Date { get; set; } = string.Empty;
        [Required, MaxLength(50)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
    }
}
