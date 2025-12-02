using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Entities.User;
using backend.Entities.Writing;
namespace backend.Entities.User
{
    public class WritingSubmission
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public string TestId { get; set; }
        [ForeignKey("TestId")]
        public WritingTest? WritingTest { get; set; }

        public string Content { get; set; } = string.Empty; // user's essay
        public int WordCount { get; set; }
        public DateTime SubmittedDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = string.Empty;
        public WritingResult? Result { get; set; }
    }
}
