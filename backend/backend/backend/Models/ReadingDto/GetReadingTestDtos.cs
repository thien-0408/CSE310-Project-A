namespace backend.Models.ReadingDto
{
    public class GetReadingTestDtos
    {
        public string Title { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public int Duration { get; set; }
        public string Skill { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string SubTitle { get; set; } = string.Empty;
        public string Button { get; set; } = string.Empty;
        public long TestTaken { get; set; }

    }
}
