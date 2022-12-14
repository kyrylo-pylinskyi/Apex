using Apex.Repository.Base;

namespace Apex.Repository.PostRepo
{
    public interface IEmployeeRepository : IBaseRepository<Employee>
    {
        Task<bool> NameReserved(string fullName);
        Task<IEnumerable<Employee>> GetCompanyEmployees(int companyId);
    }
}