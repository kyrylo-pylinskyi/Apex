using System.Security.Claims;

namespace Apex.Service.UserService
{
    public class UserService : IUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }
        public object GetMe()
        {
            if (_httpContextAccessor.HttpContext is null)
                return "HTTP Context Accessor is null";
                
            var userContext = _httpContextAccessor.HttpContext.User;
            return new
            {
                Id = userContext.FindFirstValue("user_id"),
                Name = userContext.FindFirstValue(ClaimTypes.Name),
                Email = userContext.FindFirstValue(ClaimTypes.Email),
                Phone = userContext.FindFirstValue(ClaimTypes.MobilePhone),
                Role = userContext.FindFirstValue(ClaimTypes.Role)
            };
        }

        public int GetUserId()
        {
            if (_httpContextAccessor.HttpContext is null)
                return -1;
                
            var userContext = _httpContextAccessor.HttpContext.User;
            return Int32.Parse(userContext.FindFirstValue("user_id"));
        }

        public string GetUserEmail()
        {
            if (_httpContextAccessor.HttpContext is null)
                return string.Empty;
                
            var userContext = _httpContextAccessor.HttpContext.User;
            return userContext.FindFirstValue(ClaimTypes.Email);
        }
        public string GetUserName()
        {
            if (_httpContextAccessor.HttpContext is null)
                return string.Empty;
                
            var userContext = _httpContextAccessor.HttpContext.User;
            return userContext.FindFirstValue(ClaimTypes.Name);
        }
        public string GetUserRole()
        {
            if (_httpContextAccessor.HttpContext is null)
                return string.Empty;
                
            var userContext = _httpContextAccessor.HttpContext.User;
            return userContext.FindFirstValue(ClaimTypes.Role);
        }
    }
}