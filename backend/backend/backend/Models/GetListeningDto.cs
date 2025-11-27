namespace backend.Models
{
    public class GetListeningDto
    {
        public string Title { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public int lDuration { get; set; }
        public string Skill { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string SubTitle { get; set; } = string.Empty;
        public string Button { get; set; } = string.Empty;
        public long TestTaken { get; set; }
    }
}
