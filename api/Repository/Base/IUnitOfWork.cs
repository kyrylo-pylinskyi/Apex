using Apex.Repository.UserRepo;
using Apex.Repository.PostRepo;
using Apex.Repository.CompanyRepo;
using Apex.Repository.ContractRepo;

namespace Apex.Repository.Base
{
    public interface IUnitOfWork : IAsyncDisposable
    {
        IUserRepository UserRepository { get; }
        IPostRepository PostRepository { get; }
        ICompanyRepository CompanyRepository { get; }
        IEmployeeRepository EmployeeRepository { get; }
        IContractRepository ContractRepository { get; }

        Task CompleteAsync();
    }
}