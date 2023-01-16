using System.ComponentModel.DataAnnotations;
namespace Apex.Models.RequestDto
{
    public class ChangeProfileRequest
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required, Phone]
        public string Phone { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public IFormFile? FormFile {get; set;} 
    }
}