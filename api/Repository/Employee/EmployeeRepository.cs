using System.Linq.Expressions;
using Apex.Repository.Base;

namespace Apex.Repository.PostRepo
{
    public class EmployeeRepository : BaseRepository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<bool> NameReserved(string fullName) =>
            await Exists(e => e.FullName.Equals(fullName));

        public async Task<IEnumerable<Employee>> GetCompanyEmployees(int companyId) =>
            await GetManyAsync(e => e.CompanyId == companyId);
    }
}