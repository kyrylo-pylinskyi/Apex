using System.ComponentModel.DataAnnotations;
namespace Apex.Models.RequestDto
{
    public class ContractRequest
    {
        public int PostId { get; set; }
        public int Price { get; set; }
        public string? Comment { get; set; }
    }
}