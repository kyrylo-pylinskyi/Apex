using Apex.Models.ResponseDto;

namespace Apex.Repository.CompanyRepo
{
    public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
    {
        public CompanyRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<CompanyResponse> GetCompanyById(int id){
            var company = await GetByIdAsync(id);
            return new CompanyResponse(){
                Id = company.Id,
                Name = company.Name,
                Email = company.Email,
                Phone = company.Phone,
                Location = company.Location,
                AdminId = company.AdminId
            };
        }
        public async Task<IEnumerable<CompanyResponse>> GetCompanies(){
            var company = await GetManyAsync();
            return company.Select(c => new CompanyResponse(){
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Location = c.Location,
                AdminId = c.AdminId
            });
        }
        public async Task<CompanyResponse> FindByAdminId(int id){
            var company = await GetFirstAsync(c => c.AdminId == id);
            return new CompanyResponse(){
                Id = company.Id,
                Name = company.Name,
                Email = company.Email,
                Phone = company.Phone,
                Location = company.Location,
                AdminId = company.AdminId
            };
        }
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