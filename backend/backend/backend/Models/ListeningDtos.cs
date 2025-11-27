using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Contracts;

namespace backend.Models
{
    public class CreateListeningTestDto
    {
        public string Title { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public string Skill { get; set; } = string.Empty;
        public string? QuestionRange { get; set; }
        public string? SubTitle { get; set; }
        public int AudioDuration { get; set; }

        // File Uploads
        public IFormFile? Audio { get; set; }
        public IFormFile? Image { get; set; }
        public IFormFile? JsonFile { get; set; }

        // ĐỔI CÁI NÀY: Nhận JSON String thay vì List object
        public string Parts { get; set; } = string.Empty;
    }
    public class CreateListeningPartDto
    {
        public int PartNumber { get; set; }
        public string PartTitle { get; set; } = string.Empty;
        public string Context { get; set; } = string.Empty;
        public string QuestionRange { get; set; } = string.Empty;
        public string PartAudioUrl { get; set; } = string.Empty;

        public List<CreateListeningSectionDto> Sections { get; set; } = new();
    }
    public class CreateListeningSectionDto
    {
        public int SectionNumber { get; set; }
        public string SectionRange { get; set; } = string.Empty;
        public string SectionTitle { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string? WordLimit { get; set; }
        public int? MaxAnswers { get; set; }
        public string? MapImageUrl { get; set; }

        public List<CreateListeningQuestionDto> Questions { get; set; } = new();

        // Note: Based on your entity 'ListeningOption', options require a QuestionId. 
        // If you have section-level options (like matching), your Entity needs a SectionId FK. 
        // For now, we will handle Question-level options.
    }
    public class CreateListeningQuestionDto
    {
        public int QuestionNumber { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string? Label { get; set; }
        public string? Value { get; set; }
        public bool IsInput { get; set; }
        public string? WordLimit { get; set; }

        public List<CreateListeningAnswerDto> Answers { get; set; } = new();
        public List<CreateListeningOptionDto> QuestionOptions { get; set; } = new();
    }
    public class CreateListeningAnswerDto
    {
        public string AnswerText { get; set; } = string.Empty;
    }
    public class CreateListeningOptionDto
    {
        public string Key { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
    }
    public class UploadJsonTestDto
    {
        [Required]
        public IFormFile JsonFile { get; set; }
        public string title { get; set; } = string.Empty;
        public string testType {  get; set; } = string.Empty;
        public int audioDuration { get; set; }
    }
    public class GetListeningTestDto
    {
        public int testId { get; set; }
        public string testType { get; set; }
        public string title { get; set; }
        public string skill { get; set; }
        public int audioDuration { get; set; }
        public string imageUrl { get; set; }
        public string audioUrl { get; set; }
        public string fileUrl { get; set; }

    }
}
