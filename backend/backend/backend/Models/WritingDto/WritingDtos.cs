using System.ComponentModel.DataAnnotations;

namespace backend.Models.WritingDto
{
    public class CreateWritingTestDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;

        [Required]
        public string Topic { get; set; } = string.Empty; 
        public IFormFile? Image { get; set; }
        public string Skill { get; set; } = string.Empty;
        public int Duration { get; set; } 
        public string TestType { get; set; } = string.Empty;
    }
    public class SubmitWritingDto
    {
        public string TestId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int WordCount { get; set; }
    }
    public class GradeWritingSubmissionDto
    {
        public string SubmissionId { get; set; }

        public double TaskResponse { get; set; }
        public double CoherenceCohesion { get; set; }
        public double LexicalResource { get; set; }
        public double GrammaticalRange { get; set; }
        public string GrammerFeedback { get; set; } = string.Empty;
        public string VocabularyFeedback { get; set; } = string.Empty;
        public double OverallScore { get; set; }
        public string GeneralFeedback { get; set; } = string.Empty;
       
    }
    public class WritingSubmissionSummaryDto
    {
        public string SubmissionId { get; set; }
        public string TestTitle { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public DateTime SubmittedDate { get; set; }
        public string Status { get; set; } = "Pending";
        public string ImageUrl { get; set; } = string.Empty;
    }
    public class NotificationDto
    {
        public string SubmissionId { get; set; }
        public string TestTitle { get; set; }
        public double Score { get; set; }
        public DateTime GradedDate { get; set; }
        public bool IsRead { get; set; } 
    }
    public class WritingSubmissionDetailDto
    {
        public string Id { get; set; }
        public string TestTitle { get; set; }
        public string Topic { get; set; }
        public string TestImage { get; set; }
        public string StudentName { get; set; }
        public string Content { get; set; }
        public int WordCount { get; set; }
        public DateTime SubmittedDate { get; set; }

        // Result Info
        public bool HasResult { get; set; }
        public double OverallScore { get; set; }
        public string? GeneralFeedback { get; set; }
        public string? GrammarFeedback { get; set; }
        public string? VocabularyFeedback { get; set; }
        public DateTime? GradedDate { get; set; }
    }
}
