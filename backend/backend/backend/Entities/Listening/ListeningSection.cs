using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities.Listening
{
    public class ListeningSection
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string ListeningPartId { get; set; } = string.Empty;
        [ForeignKey("ListeningPartId")]
        public ListeningPart? ListeningPart { get; set; }

        public int SectionNumber { get; set; } // 1, 2...

        public string SectionRange { get; set; } = string.Empty; 

        public string SectionTitle { get; set; } = string.Empty; 

        public string QuestionType { get; set; } = string.Empty; // form_completion, multiple_choice...

        public string Instructions { get; set; } = string.Empty; 

        public string? WordLimit { get; set; } 

        public string? MapImageUrl { get; set; } 

        public int? MaxAnswers { get; set; } 
        public ICollection<ListeningQuestion> Questions { get; set; } = new List<ListeningQuestion>();
    }
}
