using backend.Entities.Listening;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.User
{
    public class TestResult
    {
        [Key]
        public string Id { get; set; }
        public DateTime TakenDate { get; set; } = DateTime.Now;
        public double Score { get; set; }
        public bool IsCompleted { get; set; }
        public Guid UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int TestId { get; set; }
        [ForeignKey("TestId")]
        public ListeningTest? ListeningTest { get; set; }
    }
}
