using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace Apex.Models.RequestDto
{
    public class PostRequest
    {
        public int? Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public int Price { get; set; }
        public IFormFile? FormFile { get; set; }
    }
}