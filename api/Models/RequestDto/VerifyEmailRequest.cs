using System.ComponentModel.DataAnnotations;
namespace Apex.Models.RequestDto
{
    public class VerifyEmailRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; } = string.Empty;
    }
}