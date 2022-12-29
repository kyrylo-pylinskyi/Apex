namespace Apex.Models.ResponseDto
{
    public class ContractResponse
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public DateTime? CreatedAt { get; set; }
        public bool? IsActive { get; set; }
        public int? PostId { get; set; }
        public string? PostCreatorName { get; set; }
        public int? CompanyId { get; set; }
    }
}