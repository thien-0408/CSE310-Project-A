using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading
{
    public class ReadingPart
    {
        [Key]
        public Guid PartId { get; set; } // Database ID

        [ForeignKey(nameof(TestId))]
        public string TestId { get; set; }

        public int PartNumber { get; set; } // 1, 2, 3
        public string PartTitle { get; set; } = string.Empty; // "Reading Passage 1"
        public string PassageTitle { get; set; } = string.Empty; // "Can the Coral Reefs be Saved?"
        public string Skill { get; set; } = "reading";
        public string? ThumbnailUrl { get; set; }
        public int TestDuration { get; set; } // minutes
        public string? QuestionRange { get; set; } // "1-13"

        [Column(TypeName = "ntext")] 
        public string Text { get; set; } = string.Empty;

        // Navigation
        public virtual ReadingTest Test { get; set; }
        public virtual ICollection<ReadingSection> Sections { get; set; } = new List<ReadingSection>();
    }
}