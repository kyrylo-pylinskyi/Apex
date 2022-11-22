namespace Apex.Models.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public Jobs Job { get; set; }
        public decimal Salary { get; set; }
        public DateTime? EmployedAt { get; set; }
    }
}