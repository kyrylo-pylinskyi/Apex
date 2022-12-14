namespace Apex.Models.Dto
{
    public class EmployeeDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }
        public Jobs Job { get; set; }
        public decimal Salary { get; set; }
        public DateTime? EmployedAt { get; set; }
    }
}