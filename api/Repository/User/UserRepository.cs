using System.Security;
using System.Security.Cryptography;
using Apex.Models.ResponseDto;
using Apex.Repository.Base;

namespace Apex.Repository.UserRepo
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> MailReserved(string mail) =>
            await Exists(u => u.Email.Equals(mail));

        public async Task<User> FindById(int id) =>
            await GetByIdAsync(id);

        public async Task<UserResponse> GetUserDetails(int id)
        {
            var user = await GetByIdAsync(id);
            return new UserResponse()
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Phone = user.Phone,
                Bio = user.Bio,
                Avatar = user.Avatar is not null ? Convert.ToBase64String(user.Avatar) : string.Empty,
                Role = user.Role
            };
        }

        public async Task<User> FindByEmail(string email) =>
            await GetFirstAsync(u => u.Email.Equals(email));

    }
}