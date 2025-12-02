using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.User
{
    public class WritingResult
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string SubmissionId { get; set; }
        [ForeignKey("SubmissionId")]
        public WritingSubmission Submission { get; set; }

        public double OverallScore { get; set; }
        public double TaskResponseScore { get; set; }
        public double CoherenceCohesionScore { get; set; }
        public double LexicalResourceScore { get; set; } // Word Case / Vocabulary
        public double GrammaticalRangeAccuracyScore { get; set; } // Grammar Accuracy
        public string GeneralFeedback { get; set; } = string.Empty; //General feedback
        public string GrammarFeedback { get; set; } = string.Empty;
        public string VocabularyFeedback { get; set; } = string.Empty;
        public DateTime GradedDate { get; set; } = DateTime.UtcNow;
    }
}
