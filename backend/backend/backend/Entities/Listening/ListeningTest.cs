using System.ComponentModel.DataAnnotations;

namespace backend.Entities.Listening
{
    public class ListeningTest 
    {
        [Key]
        public int TestId { get; set; } 
        [Required]
        public string Title { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty; //full_test or separated_test
        public string Skill { get; set; } = string.Empty; //listening, reading
        public string? AudioUrl { get; set; } = string.Empty;
        public string? QuestionRange {  get; set; } = string.Empty; // 1 - 40 
        public string? ImageUrl { get; set; } = string.Empty;
        public string? SubTitle { get; set; } = string.Empty;
        public string? Button { get; set; } = string.Empty; // =)))) don't care about this attribute
        public int AudioDuration { get; set; } //in minute
        public virtual ICollection<ListeningPart>? Parts { get; set; } = new List<ListeningPart>();
        public string? JsonFileUrl {  get; set; } = string.Empty;   

    }
}
