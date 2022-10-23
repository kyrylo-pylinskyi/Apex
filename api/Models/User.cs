using System.ComponentModel.DataAnnotations.Schema;

namespace Apex.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Mail { get; set; }
        public string Phone { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public Role Role { get; set; }
        public string EmailCode { get; set; }
        public int CompanyId { get; set; }
        [ForeignKey("ComnpanyId")]
        public Company? Company { get; set; }

    }
}