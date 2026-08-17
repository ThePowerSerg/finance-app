using System.ComponentModel.DataAnnotations;

namespace financeAPI.DTOs
{
    public class CreateBookDto
    {
        [Required(ErrorMessage = "Title is required.")]
        [MinLength(3, ErrorMessage = "Title must be at least 3 characters.")]
        public required string Title { get; set; }
        public required string Author { get; set; }
        public string? Description { get; set; }
    }
}