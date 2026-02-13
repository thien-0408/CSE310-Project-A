using System.ComponentModel.DataAnnotations;

namespace backend.Models.WritingDto
{
    public class ScoringDto
    {
        public IFormFile? Image { get; set; }

        [Required]
        public string Question { get; set; } = string.Empty;

        [Required]
        public string Essay { get; set; } = string.Empty;

        public string TaskType { get; set; } = string.Empty;
    }
}
