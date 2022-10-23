using System.IO.Pipes;
using Apex.Models;

namespace Apex.Repository
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context)
        {
        }

        public bool MailReserved(string mail)
        {
            return Exists(u => u.Mail.Equals(mail));
        }
    }
}