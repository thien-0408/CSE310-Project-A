using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading;

public class ReadingTest
{
    [Key]
    public string TestId { get; set; } = Guid.NewGuid().ToString();

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    public string TestType { get; set; } = string.Empty;  // full_test, practice
    public string Skill { get; set; } = "reading";

    public int TotalDuration { get; set; } // In seconds
    public string? QuestionRange { get; set; } // "1-40"
    public string? ImageUrl { get; set; }
    public string? Subtitle { get; set; }
    public string? Button { get; set; } = string.Empty;

    // Navigation Property
    public virtual ICollection<ReadingPart> Parts { get; set; } = new List<ReadingPart>();
}