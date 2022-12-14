namespace Apex.Service.UserService
{
    public interface IUserService
    {
        object GetMe();
        int GetUserId();
        string GetUserEmail();
        string GetUserName();
        string GetUserRole();
    }
}