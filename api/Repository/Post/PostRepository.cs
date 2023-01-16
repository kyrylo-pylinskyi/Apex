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
            var posts = await GetManyAsync(includeProperties:"Creator");
            return posts.Select(p => new PostResponse(){
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                Price = p.Price,
                CreatedAt = $"{p.CreatedAt.ToShortDateString()} {p.CreatedAt.ToShortTimeString()}",
                CreatorId = p.CreatorId,
                Image = p.Image is not null ? Convert.ToBase64String(p.Image) : string.Empty,
                CreatorName = p.Creator.Name,
                CreatorPhoto = p.Creator.Avatar is not null ? Convert.ToBase64String(p.Creator.Avatar) : string.Empty,

            }).OrderByDescending(f => f.CreatedAt);
        }

        public async Task<PostResponse> GetPostById(int id){
            var post = await GetByIdAsync(id);
            return new PostResponse(){
                Id = post.Id,
                Title = post.Title,
                Content = post.Content,
                Price = post.Price,
                CreatedAt = $"{post.CreatedAt.ToShortDateString()} {post.CreatedAt.ToShortTimeString()}",
                CreatorId = post.CreatorId,
                Image = post.Image is not null ? Convert.ToBase64String(post.Image) : string.Empty,
            };
        }

        public async Task<IEnumerable<PostResponse>> GetUserPosts(int id){
            var posts = await GetManyAsync(p => p.CreatorId == id, includeProperties:"Creator");
            return posts.Select(p => new PostResponse(){
                Id = p.Id,
                Title = p.Title,
                Content = p.Content,
                Price = p.Price,
                CreatedAt = $"{p.CreatedAt.ToShortDateString()} {p.CreatedAt.ToShortTimeString()}",
                CreatorId = p.CreatorId,
                Image = p.Image is not null ? Convert.ToBase64String(p.Image) : string.Empty,
                CreatorName = p.Creator.Name,
                CreatorPhoto = p.Creator.Avatar is not null ? Convert.ToBase64String(p.Creator.Avatar) : string.Empty,
            }).OrderByDescending(f => f.CreatedAt);;
        }
    }
}