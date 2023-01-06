using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Apex.Models.RequestDto
{
    public class PostRequest
    {
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        public IFormFile? FormFile { get; set; }
    }
}