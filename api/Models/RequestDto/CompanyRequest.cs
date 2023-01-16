using System.ComponentModel.DataAnnotations;
namespace Apex.Models.RequestDto
{
    public class CompanyRequest
    {
        [Required]
        public string Name { get; set; }
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required, Phone]
        public string Phone { get; set; }
        [Required]
        public string Location { get; set; }
        public string Website { get; set; }
        public string? About { get; set; }
        public IFormFile? Photo { get; set; }
    }
}