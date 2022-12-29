using System.Linq.Expressions;
using Apex.Models.ResponseDto;
using Apex.Repository.Base;

namespace Apex.Repository.PostRepo
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<PostResponse>> GetPosts(){
            var posts = await GetManyAsync();
            return posts.Select(p => new PostResponse(){
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                CreatorId = p.CreatorId
            });
        }

        public async Task<PostResponse> GetPostById(int id){
            var post = await GetByIdAsync(id);
            return new PostResponse(){
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                CreatedAt = post.CreatedAt,
                CreatorId = post.CreatorId
            };
        }

        public async Task<IEnumerable<PostResponse>> GetUserPosts(int id){
            var posts = await GetManyAsync(p => p.CreatorId == id);
            return posts.Select(p => new PostResponse(){
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                CreatedAt = p.CreatedAt,
                CreatorId = p.CreatorId
            });
        }
    }
}