namespace Apex.Models.ResponseDto
{
    public class UserResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string? Bio { get; set; }
        public string? Avatar { get; set; }
        public Roles Role { get; set; }
    }
}