using System.ComponentModel.DataAnnotations;
using System.Diagnostics.Contracts;

namespace backend.Models
{
    public class ListeningDtos
    {

    }
    public class CreateQuestionDto
    {

    }
    public class UploadJsonTestDto
    {
        [Required]
        public IFormFile JsonFile { get; set; }
        public string title { get; set; } = string.Empty;
        public string testType {  get; set; } = string.Empty;
        public int audioDuration { get; set; }
    }
    public class GetListeningTestDto
    {
        public int testId { get; set; }
        public string testType { get; set; }
        public string title { get; set; }
        public string skill { get; set; }
        public int audioDuration { get; set; }
        public string imageUrl { get; set; }
        public string audioUrl { get; set; }
        public string fileUrl { get; set; }

    }
}
