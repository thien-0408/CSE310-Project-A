using backend.Entities.Writing;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace backend.Entities.User
{
    public class WritingTestResult
    {
        [Key]
        public Guid Id { get; set; }
        public DateTime TakenDate { get; set; }
        public DateTime? FinishDate { get; set; }
        public double Score { get; set; }
        public bool IsCompleted { get; set; }
        public string Skill { get; set; } = string.Empty; // writing
        public string Title { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public string TestId { get; set; }
        [ForeignKey("TestId")]
        public WritingTest? WritingTest { get; set; }
    }
}
