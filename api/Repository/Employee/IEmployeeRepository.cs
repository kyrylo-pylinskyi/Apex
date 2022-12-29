using Apex.Models.ResponseDto;

namespace Apex.Repository.PostRepo
{
    public interface IEmployeeRepository : IBaseRepository<Employee>
    {
        Task<bool> NameReserved(string fullName);
        Task<IEnumerable<EmployeeResponse>> GetEmployees();
        Task<IEnumerable<EmployeeResponse>> GetCompanyEmployees(int companyId);
        Task<EmployeeResponse> GetEmployeeById(int id);
    }
}