using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Listening
{
    public class ListeningOption
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string ListeningQuestionId { get; set; } = string.Empty;
        [ForeignKey("ListeningQuestionId")]
        public ListeningQuestion? ListeningQuestion { get; set; }

        public string Key { get; set; } = string.Empty; // A, B, C, D

        public string Text { get; set; } = string.Empty; // option content
    }
}
