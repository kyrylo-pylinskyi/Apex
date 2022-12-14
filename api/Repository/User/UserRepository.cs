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
        public async Task<User> FindByMail(string mail) => 
            await GetFirstAsync(u => u.Email.Equals(mail));
        public async Task<User> FindByToken(string token) => 
            await GetFirstAsync(u => u.VerificationToken.Equals(token));
        public async Task<User> FindByResetPasswordToken(string token) => 
            await GetFirstAsync(u => u.PasswordResetToken.Equals(token));
    }
}