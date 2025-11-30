using backend.Entities.Reading;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading
{
    public class QuestionOption
    {
        [Key]
        public Guid Id { get; set; }
        public int Index { get; set; } 

        [ForeignKey(nameof(QuestionId))]
        public Guid QuestionId { get; set; }

        public string Text { get; set; } = string.Empty; 

        public virtual ReadingQuestion Question { get; set; }
    }
    public class QuestionAnswer
    {
        [Key]
        public Guid Id { get; set; }
        public int Index { get; set; }

        [ForeignKey(nameof(QuestionId))]
        public Guid QuestionId { get; set; }
        public string Content { get; set; } = string.Empty;
        public virtual ReadingQuestion Question { get; set; }
    }
}