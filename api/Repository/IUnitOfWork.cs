namespace Apex.Repository
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        IUserRepository UserRepository { get; }

        Task CompleteAsync();
    }
}