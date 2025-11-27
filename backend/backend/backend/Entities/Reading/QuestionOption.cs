using backend.Entities.Reading;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading
{
    // Dùng cho Multiple Choice nằm trong câu hỏi (A, B, C, D)
    public class QuestionOption
    {
        [Key]
        public Guid Id { get; set; }
        public int Index { get; set; } // 0, 1, 2, 3 tương ứng A, B, C, D

        [ForeignKey(nameof(QuestionId))]
        public Guid QuestionId { get; set; }

        public string Text { get; set; } = string.Empty; // "A. They used different motor skills..."

        public virtual ReadingQuestion Question { get; set; }
    }

    // Lưu đáp án đúng
    public class QuestionAnswer
    {
        [Key]
        public Guid Id { get; set; }
        public int Index { get; set; }

        [ForeignKey(nameof(QuestionId))]
        public Guid QuestionId { get; set; }
        public string Content { get; set; } = string.Empty;
        public virtual ReadingQuestion Question { get; set; }
    }
}