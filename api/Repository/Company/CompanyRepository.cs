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
                About = company.About,
                Location = company.Location,
                AdminId = company.AdminId,
                Website = company.Website,
                Photo = company.Photo is not null ? Convert.ToBase64String(company.Photo) : string.Empty
            };
        }
        public async Task<IEnumerable<CompanyResponse>> GetCompanies(){
            var company = await GetManyAsync(includeProperties: "Admin");
            return company.Select(c => new CompanyResponse(){
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                Website = c.Website,
                About = c.About,
                Location = c.Location,
                AdminId = c.AdminId,
                Photo = c.Photo is not null ? Convert.ToBase64String(c.Photo) : string.Empty,
                AdminName = c.Admin.Name,
                AdminPhoto = c.Admin.Avatar is not null ? Convert.ToBase64String(c.Admin.Avatar) : string.Empty,
                AdminEmail = c.Admin.Email,
                AdminPhone = c.Admin.Phone,
                AdminBio = c.Admin.Bio,
            });
        }
        public async Task<CompanyResponse> FindByAdminId(int id){
            var company = await GetFirstAsync(c => c.AdminId == id);
            if(company is null){
                return null;
            }
            return new CompanyResponse(){
                Id = company.Id,
                Name = company.Name,
                Email = company.Email,
                Phone = company.Phone,
                About = company.About,
                Location = company.Location,
                AdminId = company.AdminId,
                Website = company.Website,
                Photo = company.Photo is not null ? Convert.ToBase64String(company.Photo) : string.Empty,
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