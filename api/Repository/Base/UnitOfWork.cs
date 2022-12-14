using Apex.Repository.CompanyRepo;
using Apex.Repository.PostRepo;
using Apex.Repository.UserRepo;
using Apex.Repository.ContractRepo;

namespace Apex.Repository.Base
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private UserRepository _userRepository;
        private PostRepository _postRepository;
        private CompanyRepository _companyRepository;
        private EmployeeRepository _employeeRepository;
        private ContractRepository _contractRepository;
        public IUserRepository UserRepository => _userRepository ?? (_userRepository = new UserRepository(_dbContext));
        public IPostRepository PostRepository => _postRepository ?? (_postRepository = new PostRepository(_dbContext));
        public ICompanyRepository CompanyRepository => _companyRepository ?? (_companyRepository = new CompanyRepository(_dbContext));
        public IEmployeeRepository EmployeeRepository => _employeeRepository ?? (_employeeRepository = new EmployeeRepository(_dbContext));
        public IContractRepository ContractRepository => _contractRepository ?? (_contractRepository = new ContractRepository(_dbContext));

        public UnitOfWork(AppDbContext dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }

        public async Task CompleteAsync() => await _dbContext.SaveChangesAsync();

        private bool _disposed;
        public async ValueTask DisposeAsync()
        {
            await DisposeAsync(true);
            GC.SuppressFinalize(this);
        }

        protected virtual async ValueTask DisposeAsync(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    // Dispose managed resources.
                    await _dbContext.DisposeAsync();
                }

                // Dispose any unmanaged resources here...

                _disposed = true;
            }
        }

    }
}