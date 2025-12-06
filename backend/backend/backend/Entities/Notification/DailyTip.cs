using System.ComponentModel.DataAnnotations;

namespace backend.Entities.Notification
{
    public class DailyTip
    {
        [Key]
        public string Id = Guid.NewGuid().ToString();
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category {  get; set; } = string.Empty;
    }
}
