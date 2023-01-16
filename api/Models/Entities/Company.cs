using System.ComponentModel.DataAnnotations.Schema;

namespace Apex.Models.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Website { get; set; }
        public string Location { get; set; }
        public string? About { get; set; }
        public byte[] Photo { get; set; }
        public int AdminId { get; set; }
        [ForeignKey("AdminId")]
        public User? Admin { get; set; }

        public List<Employee>? Employees { get; set; }
        public List<Contract>? Contracts { get; set; }
    }
}