namespace backend.Entities
{
    public class MileStone
    {
        public Guid Id { get; set; }
        public string Date { get; set; } = string.Empty;
        public string EventTitle { get; set; } = string.Empty;
        public string EventDetail { get; set; } = string.Empty;
        public Guid UserId { get; set; }

    }
}
