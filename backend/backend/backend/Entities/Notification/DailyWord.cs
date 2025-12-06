using System.ComponentModel.DataAnnotations;

namespace backend.Entities.Notification
{
    public class DailyWord
    {
        [Key]
        public string Id = Guid.NewGuid().ToString();
        public string Word {get;set; } = string.Empty;
        public string Phonetic { get; set; } = string.Empty;
        public string Type { get;set; } = string.Empty;
        public string Definition { get;set; } = string.Empty;
        public string Example { get;set; } = string.Empty;
    }
}
