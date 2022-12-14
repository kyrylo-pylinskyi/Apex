using System.Linq.Expressions;
using Apex.Repository.Base;

namespace Apex.Repository.CompanyRepo
{
    public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Company> FindByAdminId(int id) =>
            await GetFirstAsync(c => c.AdminId == id);
        public async Task<bool> UserHaveCompany(int id) =>
            await Exists(c => c.AdminId == id);
        public async Task<bool> EmailReserved(string email) =>
            await Exists(c => c.Email.Equals(email));

        public async Task<bool> NameReserved(string name) => 
            await Exists(c => c.Name.Equals(name));

        public async Task<bool> PhoneReserved(string phone) =>
            await Exists(c => c.Phone.Equals(phone));
    }
}