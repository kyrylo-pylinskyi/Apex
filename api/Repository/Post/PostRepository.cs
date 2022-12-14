using System.Linq.Expressions;
using Apex.Repository.Base;

namespace Apex.Repository.PostRepo
{
    public class PostRepository : BaseRepository<Post>, IPostRepository
    {
        public PostRepository(AppDbContext context) : base(context)
        {
        }

    }
}