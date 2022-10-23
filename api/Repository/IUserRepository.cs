using Apex.Models;

namespace Apex.Repository
{
    public interface IUserRepository : IBaseRepository<User>
    {
        bool MailReserved(string mail);
    }
}