using System.ComponentModel.DataAnnotations;
namespace Apex.Models.Dto
{
    public class PostDto
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
    }
}