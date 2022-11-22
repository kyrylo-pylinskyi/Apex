namespace Apex.Repository
{
    public interface IUserRepository : IBaseRepository<User>
    {
        Task<bool> MailReserved(string mail);
        Task<User> FindByMail(string mail);
        Task<User> FindByToken(string token);
        Task<User> FindByResetPasswordToken(string token);
    }
}