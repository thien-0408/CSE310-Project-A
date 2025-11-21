using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Collections.Specialized.BitVector32;

namespace backend.Entities
{
    public class ListeningQuestion
    {
        [Key]
        public string QuestionId { get; set; }

        [Required]
        public string SectionId { get; set; }

        public int QuestionNumber { get; set; } //1, 2, 3, 4

        [MaxLength(1000)]
        public string QuestionText { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? Label { get; set; } = string.Empty; // For form_completion

        [MaxLength(200)]
        public string? Value { get; set; } = string.Empty; // For display-only fields

        public bool IsInput { get; set; } // for form_completion

        [MaxLength(100)]
        public string? WordLimit { get; set; } = string.Empty;


        // Foreign key
        [ForeignKey(nameof(SectionId))]
        public virtual ListeningSection Section { get; set; }

        // Navigation properties
        public virtual ICollection<ListeningAnswer>? Answers { get; set; } = new List<ListeningAnswer>(); // nullable
        public virtual ICollection<ListeningOption>? QuestionOptions { get; set; } = new List<ListeningOption>();
    }
}
