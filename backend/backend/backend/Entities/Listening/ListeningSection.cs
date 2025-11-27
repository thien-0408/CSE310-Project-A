using backend.Entities.Listening;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Listening
{
    public class ListeningSection
    {
        [Key]
        public string SectionId { get; set; } = string.Empty; // 

        public string PartId { get; set; } //FK for Part

        public int SectionNumber { get; set; } // 1, 2, 3, 4

        [MaxLength(50)]
        public string SectionRange { get; set; } = string.Empty; // 1-13

        [MaxLength(300)]
        public string SectionTitle { get; set; } = string.Empty; //

        [Required]
        [MaxLength(100)]
        public string QuestionType { get; set; } = string.Empty; // form_completion, multiple_choice, etc.

        [MaxLength(500)]
        public string Instructions { get; set; } = string.Empty; 

        [MaxLength(100)]
        public string? WordLimit { get; set; } = string.Empty; // no more than 3 words..

        public int? MaxAnswers { get; set; }  // For multiple_answer questions

        [MaxLength(500)]
        public string? MapImageUrl { get; set; } = string.Empty; // For map_labeling questions

        // Foreign key
        [ForeignKey(nameof(PartId))]
        public virtual ListeningPart TestPart { get; set; } 

        // Navigation properties
        public virtual ICollection<ListeningQuestion> Questions { get; set; } = new List<ListeningQuestion>();
        public virtual ICollection<ListeningOption> Options { get; set; } = new List<ListeningOption>();
    }
}
