using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq; // Để xử lý dynamic data

namespace backend.Models.ReadingDto
{
    // DTO nhận request từ Form
    public class CreateReadingTestDto
    {
        public string Title { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public string Skill { get; set; } = "reading";
        public int TotalDuration { get; set; }
        public string? QuestionRange { get; set; }
        public string? Subtitle { get; set; }

        public IFormFile? Image { get; set; }
        public string Parts { get; set; } = "[]"; // JSON String
    }

    // DTO để Deserialize JSON Parts
    public class ReadingPartDto
    {
        public int PartNumber { get; set; } // 1, 2, 3
        public string PartTitle { get; set; } = string.Empty;
        public string PassageTitle { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public List<ReadingSectionDto> Sections { get; set; } = new();
    }

    public class ReadingSectionDto
    {
        public int SectionNumber { get; set; } // 1, 2
        public string SectionRange { get; set; } = string.Empty;
        public string SectionTitle { get; set; } = string.Empty;
        public string QuestionType { get; set; } = string.Empty;
        public string Instructions { get; set; } = string.Empty;
        public string? WordLimit { get; set; }

        // Data đặc thù
        public List<string>? Headings { get; set; }
        public object? Table { get; set; }
        public string? Text { get; set; } // Gap fill text
        public List<string>? Options { get; set; } // Summary options

        public List<ReadingQuestionDto> Questions { get; set; } = new();
    }

    public class ReadingQuestionDto
    {
        public int Id { get; set; } // ID ảo từ frontend (để mapping logic nếu cần)
        public int QuestionNumber { get; set; } // Số thứ tự câu hỏi (quan trọng)
        public string Question { get; set; } = string.Empty;

        public List<string>? Diagram { get; set; }
        public List<string>? Options { get; set; } // A, B, C, D

        public object Answer { get; set; } // Int, String hoặc Array
    }
}