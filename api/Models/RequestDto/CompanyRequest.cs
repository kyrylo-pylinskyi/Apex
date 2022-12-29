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
    }
}