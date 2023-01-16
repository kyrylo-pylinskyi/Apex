using System.ComponentModel.DataAnnotations.Schema;

namespace Apex.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public byte[]? Avatar { get; set; }
        public string? Bio { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public Roles Role { get; set; }
        public byte[]? VerificationTokenHash { get; set; }
        public byte[]? VerificationTokenSalt { get; set; }
        public DateTime? VerifiedAt { get; set; }
        public byte[]? PasswordResetTokenHash { get; set; }
        public byte[]? PasswordResetTokenSalt { get; set; }
        public DateTime? ResetTokenExpires { get; set; }
        public int? CompanyId { get; set; }
        [ForeignKey("CompanyId")]
        public Company? Company { get; set; }
    }
}