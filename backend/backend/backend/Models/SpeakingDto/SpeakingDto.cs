using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace backend.Models.SpeakingDto
{
    public class SpeakingCreateDto
    {
        [Required]
        public IFormFile Audio { get; set; } = null!;

        [Required]
        public string Question { get; set; } = string.Empty;
    }
}
