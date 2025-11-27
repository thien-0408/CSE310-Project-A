using backend.Entities.Listening;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Collections.Specialized.BitVector32;

namespace backend.Entities.Listening
{
    public class ListeningOption
    {
        [Key]
        public int OptionId { get; set; }

        [Required]
        public string QuestionId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Key { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Text { get; set; } = string.Empty;
        // Foreign key
        [ForeignKey(nameof(QuestionId))]
        public virtual ListeningQuestion Question { get; set; }
    }
}
