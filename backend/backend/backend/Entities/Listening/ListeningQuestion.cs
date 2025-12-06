using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Listening
{
    public class ListeningQuestion
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ListeningSectionId { get; set; } = string.Empty;
        [ForeignKey("ListeningSectionId")]
        public ListeningSection? ListeningSection { get; set; }

        public int QuestionNumber { get; set; } // 1, 2, 3...

        public string QuestionText { get; set; } = string.Empty; 

        public string? Label { get; set; }

        public string? Value { get; set; }

        public bool? IsInput { get; set; } 

        public string? WordLimit { get; set; } 

        
        public ICollection<ListeningAnswer> Answers { get; set; } = new List<ListeningAnswer>();

        public ICollection<ListeningOption> Options { get; set; } = new List<ListeningOption>();
    }
}
