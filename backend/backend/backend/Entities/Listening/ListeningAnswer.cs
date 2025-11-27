using backend.Entities.Listening;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Listening
{
    public class ListeningAnswer
    {
        [Key]
        public string AnswerId { get; set; }

        [Required]
        public string QuestionId { get; set; }

        [Required]
        [MaxLength(500)]
        public string AnswerText { get; set; } = string.Empty;

        // Foreign key
        [ForeignKey(nameof(QuestionId))]
        public virtual ListeningQuestion Question { get; set; }
    }
}
