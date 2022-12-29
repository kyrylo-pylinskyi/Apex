using System.ComponentModel.DataAnnotations;
namespace Apex.Models.RequestDto
{
    public class PostRequest
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
    }
}