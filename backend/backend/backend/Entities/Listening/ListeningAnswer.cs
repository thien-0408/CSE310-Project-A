using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Listening
{
    public class ListeningAnswer
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string ListeningQuestionId { get; set; } = string.Empty;
        [ForeignKey("ListeningQuestionId")]
        public ListeningQuestion? ListeningQuestion { get; set; }

        public string AnswerText { get; set; } = string.Empty; // Correct answer
    }
}
