using Apex.Models.ResponseDto;

namespace Apex.Repository.CompanyRepo
{
    public interface ICompanyRepository : IBaseRepository<Company>
    {
        Task<CompanyResponse> GetCompanyById(int id);
        Task<IEnumerable<CompanyResponse>> GetCompanies();
        Task<CompanyResponse> FindByAdminId(int id);
        Task<bool> UserHaveCompany(int id);
        Task<bool> NameReserved(string name);
        Task<bool> EmailReserved(string email);
        Task<bool> PhoneReserved(string phone);
    }
}