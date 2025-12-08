namespace backend.Models
{
    public class TestSummaryDto
    {
        public string TestId { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public string Skill { get; set; } = string.Empty; // "reading" hoặc "listening"
        public string ImageUrl { get; set; } = string.Empty;
        public string SubTitle { get; set; } = string.Empty;
        public string Button { get; set; } = "Start Now";
        public long TestTaken { get; set; }
        //public List<int> Passage { get; set; } = new List<int>();
    }
    public class ModifyTestDto
    {
        public string Title { get; set;} = string.Empty;
        public IFormFile? CoverImage { get; set; } 
    }
}
