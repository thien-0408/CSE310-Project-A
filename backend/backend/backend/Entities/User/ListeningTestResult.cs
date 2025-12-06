using backend.Entities.Listening;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.User
{
    public class ListeningTestResult
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime TakenDate { get; set; } = DateTime.UtcNow;
        public DateTime FinishDate { get; set; } = DateTime.UtcNow;
        public double Score { get; set; }
        public bool IsCompleted { get; set; }
        public string Skill { get; set; } = "listening";
        public string Title { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        public string TestId { get; set; }
        [ForeignKey("TestId")]
        public ListeningTest? ListeningTest { get; set; }

    }
}
