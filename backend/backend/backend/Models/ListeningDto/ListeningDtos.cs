using System.ComponentModel.DataAnnotations;

namespace backend.Models.ListeningDto
{
    public class CreateListeningAnswerDto
    {
        public string AnswerText { get; set; } = string.Empty;
        public string? Explanation { get; set; }
    }

    public class CreateListeningOptionDto
    {
        public string Key { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
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
        public List<CreateListeningOptionDto> Options { get; set; } = new();
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
        public IFormFile? MapImage { get; set; } 
        // Lưu ý: Không để IFormFile MapImage ở đây
        public List<CreateListeningQuestionDto> Questions { get; set; } = new();
    }

    public class CreateListeningPartDto
    {
        public int PartNumber { get; set; }
        public string PartTitle { get; set; } = string.Empty;
        public string? Context { get; set; }
        public string QuestionRange { get; set; } = string.Empty;
        public List<CreateListeningSectionDto> Sections { get; set; } = new();
    }

    // --- MAIN DTO (Dùng trong Controller) ---
    public class CreateListeningTestRequest
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        public string SubTitle { get; set; } = string.Empty;
        public string QuestionRange { get; set; } = string.Empty;
        public int AudioDuration { get; set; }

        // 1. CHUỖI JSON CHỨA CẤU TRÚC BÀI THI (Parts -> Sections -> Questions)
        [Required]
        public string PartsJson { get; set; } = string.Empty;

        // 2. FILES (Gửi riêng)
        public IFormFile? TestAudioFile { get; set; }
        public IFormFile? TestImageFile { get; set; }

        // Danh sách file audio cho từng Part (Thứ tự phải khớp với thứ tự trong mảng PartsJson)
        public List<IFormFile> PartAudioFiles { get; set; } = new();

        // (Tùy chọn) Danh sách ảnh Map cho Section
        public List<IFormFile> SectionMapImages { get; set; } = new();
    }
}
