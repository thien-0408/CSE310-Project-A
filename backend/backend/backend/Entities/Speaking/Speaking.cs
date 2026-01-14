using System;

namespace backend.Entities.Speaking
{
    public class Speaking
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string Question { get; set; } = string.Empty;

        public string AudioPath { get; set; } = string.Empty;

        // Text sau khi speech-to-text (test thì để null)
        public string? Transcript { get; set; }

        // Điểm tổng (test)
        public double? Score { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
