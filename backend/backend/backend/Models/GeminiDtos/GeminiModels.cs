namespace backend.Models.GeminiDtos
{
    public class GeminiRequest
    {
        public List<Content> contents { get; set; }
    }
    public class Content
    {
        public List<Part> parts { get; set; }
    }
    public class Part
    {
        public string text { get; set; }
        public InlineData inline_data { get; set; }
    }

    public class InlineData
    {
        public string mime_type { get; set; }
        public string data { get; set; }
    }

    // Class để hứng response
    public class GeminiResponse
    {
        public List<Candidate> candidates { get; set; }
    }

    public class Candidate
    {
        public Content content { get; set; }
    }
}
