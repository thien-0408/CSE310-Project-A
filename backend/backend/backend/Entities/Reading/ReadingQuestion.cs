using backend.Entities.Reading;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading
{
    public class ReadingQuestion
    {
        [Key]
        public Guid Id { get; set; }
        public int QuestionNumber { get; set; }   // Tương ứng với "id": 1 trong JSON

        [ForeignKey(nameof(SectionId))]
        public Guid SectionId { get; set; }

        public string QuestionText { get; set; } = string.Empty; // "What does the writer say...?"

        // Cho dạng "Diagram Labeling": Lưu danh sách các nhãn dưới dạng chuỗi JSON
        // Ví dụ: ["Brain", "Blood Flow", "____"]
        public string? DiagramLabelsJson { get; set; }

        // Navigation
        public virtual ReadingSection Section { get; set; }

        // Đáp án đúng (Có thể có nhiều đáp án đúng hoặc dạng mảng)
        public virtual ICollection<QuestionAnswer> Answers { get; set; } = new List<QuestionAnswer>();

        // Các lựa chọn (A, B, C, D) cho câu hỏi trắc nghiệm riêng lẻ
        public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
    }
}