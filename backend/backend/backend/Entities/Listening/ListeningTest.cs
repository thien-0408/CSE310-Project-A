using System.ComponentModel.DataAnnotations;

namespace backend.Entities.Listening
{
    public class ListeningTest
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required]
        public string Title { get; set; } = string.Empty; 

        public string SubTitle { get; set; } = string.Empty; // Multiple choice,...

        public string TestType { get; set; } = string.Empty;

        public string Skill { get; set; } = "listening"; 

        public string? AudioUrl { get; set; } 

        public string? ImageUrl { get; set; } 

        public string QuestionRange { get; set; } = string.Empty; 

        public int AudioDuration { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ListeningPart> Parts { get; set; } = new List<ListeningPart>();
    }
}
