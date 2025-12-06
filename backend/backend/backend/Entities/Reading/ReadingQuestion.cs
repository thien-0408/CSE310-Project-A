using backend.Entities.Reading;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading
{
    public class ReadingQuestion
    {
        [Key]
        public Guid Id { get; set; }
        public int QuestionNumber { get; set; }   

        [ForeignKey(nameof(SectionId))]
        public Guid SectionId { get; set; }

        public string QuestionText { get; set; } = string.Empty; // "What does the writer say...?"

        public string? DiagramLabelsJson { get; set; }

        // Navigation
        public virtual ReadingSection Section { get; set; }

        public virtual ICollection<QuestionAnswer> Answers { get; set; } = new List<QuestionAnswer>();

        public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
    }
}