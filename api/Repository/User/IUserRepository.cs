using Apex.Models.ResponseDto;
using Apex.Repository.Base;

namespace Apex.Repository.UserRepo
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<bool> MailReserved(string mail);
        Task<User> FindById(int id);
        Task<User> FindByEmail(string email);
        Task<UserResponse> GetUserDetails(int id);
    }
}