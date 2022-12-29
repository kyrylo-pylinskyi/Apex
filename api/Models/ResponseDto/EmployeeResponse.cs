namespace Apex.Models.ResponseDto
{
    public class EmployeeResponse
    {
        public int? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public DateTime? BirthDate { get; set; }
        public Jobs? Job { get; set; }
        public decimal? Salary { get; set; }
        public DateTime? EmployedAt { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
    }
}