using System.ComponentModel.DataAnnotations;

namespace Apex.Models.RequestDto
{
    public class EmailRequest
    {
        [Required, EmailAddress]
        public string To { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
    }
}