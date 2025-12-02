using System.ComponentModel.DataAnnotations;

namespace backend.Models.WritingDto
{
    public class CreateWritingTestDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;

        [Required]
        public string Topic { get; set; } = string.Empty; 
        public IFormFile? Image { get; set; }
        public string Skill { get; set; } = string.Empty;
        public int Duration { get; set; } 
        public string TestType { get; set; } = string.Empty;
    }
}
