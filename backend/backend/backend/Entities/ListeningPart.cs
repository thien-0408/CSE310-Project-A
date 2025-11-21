using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using static System.Collections.Specialized.BitVector32;

namespace backend.Entities
{
    public class ListeningPart
    {
        [Key]
        public string PartId { get; set; }

        [ForeignKey(nameof(TestId))]
        public int TestId { get; set; } //FK 

        public int PartNumber { get; set; } // 1, 2 , 3, 4
        public string PartTitle { get; set; } = string.Empty;
        public string Context { get; set; } = string.Empty;
        public string QuestionRange { get; set; } = string.Empty; // 1- 10 
        public string PartAudioUrl { get; set; } = string.Empty;

        public virtual ListeningTest? ListeningTest { get; set; }
        public virtual ICollection<ListeningSection> Sections { get; set; } = new List<ListeningSection>();


    }
}
