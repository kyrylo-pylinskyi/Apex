namespace Apex.Models.ResponseDto
{
    public class ContractResponse
    {
        public int? Id { get; set; }
        public string? Name { get; set; }
        public int? Price { get; set; }
        public string? Comment { get; set; }
        public string? CreatedAt { get; set; }
        public bool? IsActive { get; set; }
        public int? PostId { get; set; }
        public string? PostTitle { get; set; }
        public string? PostCreatorName { get; set; }
        public int? PostPrice { get; set; }
        public string? PostPhoto { get; set; }
        public string? PostContent { get; set; }
        public string? PostCreatorPhoto { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyPhoto { get; set; }
        public int? CompanyId { get; set; }
        public int? CompanyAdminId { get; set; }
    }
}