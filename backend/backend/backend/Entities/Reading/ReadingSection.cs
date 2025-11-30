using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading;

public class ReadingSection
{
    [Key]
    public Guid SectionId { get; set; }
    public int SectionNumber { get; set; } // 1, 2, 3...

    [ForeignKey(nameof(PartId))]
    public Guid PartId { get; set; }

    public string SectionRange { get; set; } = string.Empty; // "Questions 1-5"
    public string SectionTitle { get; set; } = string.Empty; // "Multiple Choice"
    public string QuestionType { get; set; } = string.Empty; // "multiple_choice", "table_completion", etc.
    public string Instructions { get; set; } = string.Empty;
    public string? WordLimit { get; set; } // "NO MORE THAN TWO WORDS"

    public string? GapFillText { get; set; }
    public string? TableJson { get; set; }
    public string? OptionRange { get; set; }
    // Navigation
    public virtual ReadingPart Part { get; set; }
    public virtual ICollection<ReadingQuestion> Questions { get; set; } = new List<ReadingQuestion>();
    public virtual ICollection<SectionOption> SectionOptions { get; set; } = new List<SectionOption>();

}