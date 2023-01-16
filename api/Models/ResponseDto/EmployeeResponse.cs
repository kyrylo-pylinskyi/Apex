namespace Apex.Models.ResponseDto
{
    public class EmployeeResponse
    {
        public int? Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Photo { get; set; }
        public string? BirthDate { get; set; }
        public Jobs? Job { get; set; }
        public decimal? Salary { get; set; }
        public string? EmployedAt { get; set; }
        public int? CompanyId { get; set; }
        public string? CompanyName { get; set; }
    }
}