namespace backend.Entities.Writing
{
    public class WritingTest
    {
        public string TestId { get; set; } = Guid.NewGuid().ToString();
        public string Title { get; set; } = string.Empty;
        public string TestType { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
