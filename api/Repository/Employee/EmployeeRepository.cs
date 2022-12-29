using System.Linq.Expressions;
using Apex.Models.ResponseDto;
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

        public async Task<IEnumerable<EmployeeResponse>> GetEmployees(){
            var employees = await GetManyAsync();
            return employees.Select(e => new EmployeeResponse(){
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                FullName = e.FullName,
                BirthDate = e.BirthDate,
                Job = e.Job,
                Salary = e.Salary,
                EmployedAt = e.EmployedAt,
                CompanyId = e.CompanyId,
                CompanyName = e.Company.Name
            });
        }

        public async Task<IEnumerable<EmployeeResponse>> GetCompanyEmployees(int companyId){
            var employees = await GetManyAsync(e => e.CompanyId == companyId);
            return employees.Select(e => new EmployeeResponse(){
                Id = e.Id,
                FirstName = e.FirstName,
                LastName = e.LastName,
                FullName = e.FullName,
                BirthDate = e.BirthDate,
                Job = e.Job,
                Salary = e.Salary,
                EmployedAt = e.EmployedAt,
                CompanyId = e.CompanyId,
                CompanyName = e.Company.Name
            });
        }

        public async Task<EmployeeResponse> GetEmployeeById(int id)
        {
            var employee = await GetByIdAsync(id);
            return new EmployeeResponse(){
                Id = employee.Id,
                FirstName = employee.FirstName,
                LastName = employee.LastName,
                FullName = employee.FullName,
                BirthDate = employee.BirthDate,
                Job = employee.Job,
                Salary = employee.Salary,
                EmployedAt = employee.EmployedAt,
                CompanyId = employee.CompanyId,
                CompanyName = employee.Company.Name
            };
        }
    }
}