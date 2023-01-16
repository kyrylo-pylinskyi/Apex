namespace Apex.Models.RequestDto
{
    public class EmployeeRequest
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public IFormFile? Avatar { get; set; }
        public DateTime BirthDate { get; set; }
        public Jobs Job { get; set; }
        public decimal Salary { get; set; }
        public DateTime EmployedAt { get; set; }
    }
}