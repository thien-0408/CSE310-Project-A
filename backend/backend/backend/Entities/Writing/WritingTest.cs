using backend.Entities.User;
using System.ComponentModel.DataAnnotations;

namespace backend.Entities.Writing
{
    public class WritingTest
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; } = string.Empty; 
        public string Topic { get; set; } = string.Empty;
        public string Skill { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty; //Barchart, piechart
        public string? ImageUrl { get; set; } 
        public int Duration { get; set; } 
        public string TestType { get; set; } = string.Empty; //Task1,2
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<WritingSubmission> Submissions { get; set; } = new List<WritingSubmission>();
    }
}
