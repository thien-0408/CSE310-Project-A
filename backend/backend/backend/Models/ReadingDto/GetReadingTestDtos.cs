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
    public class GetResultDto
    {
        public Guid TestId { get; set; }
        public double Accuracy { get; set; }
        public bool IsCompleted { get; set; }
        public string Skill { get; set; } = string.Empty;
        public DateTime TakenDate { get; set; }
        public DateTime FinishDate { get; set; } = DateTime.UtcNow;
        public string Title { get; set; } = string.Empty;

    }
}

