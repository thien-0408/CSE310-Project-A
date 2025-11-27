using backend.Entities.Reading;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Reading
{
    // Bảng này lưu danh sách Headings hoặc danh sách Tên người (David Attenborough...)
    public class SectionOption
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey(nameof(SectionId))]
        public Guid SectionId { get; set; }

        // Ví dụ: "i. Experiments on typing skills" hoặc "A. David Attenborough"
        public string Text { get; set; } = string.Empty;

        // Tùy chọn: Lưu key riêng nếu cần (ví dụ "A", "i", "ii")
        public string? Key { get; set; }

        public virtual ReadingSection Section { get; set; }
    }
}