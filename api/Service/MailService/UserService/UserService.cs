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
    }
}