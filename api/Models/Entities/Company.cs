using System.ComponentModel.DataAnnotations.Schema;

namespace Apex.Models.Entities
{
    public class Company
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Location { get; set; }

        public int AdminId { get; set; }

        public List<Employee>? Employees { get; set; }
        public List<Contract>? Contracts { get; set; }
    }
}