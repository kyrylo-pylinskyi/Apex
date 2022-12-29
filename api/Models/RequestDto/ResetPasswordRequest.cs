using System.ComponentModel.DataAnnotations;
namespace Apex.Models.RequestDto
{
    public class ResetPasswordRequest
    {
        [Required, EmailAddress]
        public string Email { get; set; }
        [Required]
        public string Token { get; set; } = string.Empty;
        [Required, MinLength(6, ErrorMessage = "Please enter at least 6 characters")]
        public string Password { get; set; } = string.Empty;
        [Required, Compare("Password")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}