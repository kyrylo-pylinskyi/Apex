using Apex.Models.ResponseDto;
using Apex.Repository.Base;

namespace Apex.Repository.PostRepo
{
    public interface IPostRepository : IBaseRepository<Post>
    {
        Task<IEnumerable<PostResponse>> GetPosts();
        Task<PostResponse> GetPostById(int id);
        Task<IEnumerable<PostResponse>> GetUserPosts(int id);
    }
}