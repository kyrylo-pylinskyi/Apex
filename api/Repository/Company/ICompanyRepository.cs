using Apex.Repository.Base;

namespace Apex.Repository.CompanyRepo
{
    public interface ICompanyRepository : IBaseRepository<Company>
    {
        Task<Company> FindByAdminId(int id);
        Task<bool> UserHaveCompany(int id);
        Task<bool> NameReserved(string name);
        Task<bool> EmailReserved(string email);
        Task<bool> PhoneReserved(string phone);
    }
}