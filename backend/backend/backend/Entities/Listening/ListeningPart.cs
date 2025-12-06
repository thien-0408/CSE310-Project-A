using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Listening
{
    public class ListeningPart
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ListeningTestId { get; set; } = string.Empty;
        [ForeignKey("ListeningTestId")]
        public ListeningTest? ListeningTest { get; set; }

        public int PartNumber { get; set; } // 1,2,3

        public string PartTitle { get; set; } = string.Empty; 

        public string? Context { get; set; }

        public string QuestionRange { get; set; } = string.Empty; // 1-10

        public string? PartAudioUrl { get; set; } 

        public ICollection<ListeningSection> Sections { get; set; } = new List<ListeningSection>();
    }
}
