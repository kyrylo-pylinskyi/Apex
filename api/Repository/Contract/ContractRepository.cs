using System.Linq.Expressions;
using Apex.Models.ResponseDto;
using Apex.Repository.Base;

namespace Apex.Repository.ContractRepo
{
    public class ContractRepository : BaseRepository<Contract>, IContractRepository
    {
        public ContractRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<ContractResponse>> GetContracts(){
            string[] props = {"Post.Creator", "Company", "Post"};
            var contracts = await GetManyAsync(includeProperties: props);
            return contracts.Select(c => new ContractResponse(){
                Id = c.Id,
                Name = c.Name,
                Price = c.Price,
                Comment = c.Comment,
                CreatedAt = $"{c.CreatedAt.ToShortDateString()} {c.CreatedAt.ToShortTimeString()}",
                IsActive = c.IsActive,
                PostId = c.PostId,
                PostContent = c.Post.Content,
                PostTitle = c.Post.Title,
                PostPrice = c.Post.Price,
                CompanyId = c.CompanyId,
                CompanyName = c.Name, 
                CompanyAdminId = c.Company.AdminId,
                PostCreatorName = c.Post.Creator.Name,
                PostPhoto = c.Post.Image is not null ? Convert.ToBase64String(c.Post.Image) : string.Empty,
                PostCreatorPhoto = c.Post.Creator.Avatar is not null ? Convert.ToBase64String(c.Post.Creator.Avatar) : string.Empty,
                CompanyPhoto = c.Company.Photo is not null ? Convert.ToBase64String(c.Company.Photo) : string.Empty,
            });
        }

        public async Task<IEnumerable<ContractResponse>> GetCompanyContracts(int companyId){
            string[] props = {"Post.Creator", "Company"};
            var contracts = await GetManyAsync(c => c.CompanyId == companyId, includeProperties: props);
            return contracts.Select(c => new ContractResponse(){
                Id = c.Id,
                Name = c.Name,
                Price = c.Price,
                Comment = c.Comment,
                CreatedAt = $"{c.CreatedAt.ToShortDateString()} {c.CreatedAt.ToShortTimeString()}",
                IsActive = c.IsActive,
                PostId = c.PostId,
                PostContent = c.Post.Content,
                PostTitle = c.Post.Title,
                PostPrice = c.Post.Price,
                CompanyId = c.CompanyId,
                PostCreatorName = c.Post.Creator.Name,
                CompanyName = c.Company.Name,
                PostPhoto = c.Post.Image is not null ? Convert.ToBase64String(c.Post.Image) : string.Empty,
                PostCreatorPhoto = c.Post.Creator.Avatar is not null ? Convert.ToBase64String(c.Post.Creator.Avatar) : string.Empty,
                CompanyPhoto = c.Company.Photo is not null ? Convert.ToBase64String(c.Company.Photo) : string.Empty,
            }).OrderByDescending(f => f.CreatedAt);
        }

        public async Task<IEnumerable<ContractResponse>> GetUserContracts(int userId){
            string[] props = {"Post.Creator", "Company"};
            var contracts = await GetManyAsync(c => c.Post.CreatorId == userId, includeProperties: props);
            return contracts.Select(c => new ContractResponse(){
                Id = c.Id,
                Name = c.Name,
                Price = c.Price,
                Comment = c.Comment,
                CreatedAt = $"{c.CreatedAt.ToShortDateString()} {c.CreatedAt.ToShortTimeString()}",
                IsActive = c.IsActive,
                PostId = c.PostId,
                PostContent = c.Post.Content,
                PostTitle = c.Post.Title,
                PostPrice = c.Post.Price,
                CompanyId = c.CompanyId,
                PostCreatorName = c.Post.Creator.Name,
                CompanyName = c.Company.Name,
                PostPhoto = c.Post.Image is not null ? Convert.ToBase64String(c.Post.Image) : string.Empty,
                PostCreatorPhoto = c.Post.Creator.Avatar is not null ? Convert.ToBase64String(c.Post.Creator.Avatar) : string.Empty,
                CompanyPhoto = c.Company.Photo is not null ? Convert.ToBase64String(c.Company.Photo) : string.Empty,
            }).OrderByDescending(f => f.CreatedAt);
        }

        public async Task<ContractResponse> GetContractById(int id){
            var contract = await GetByIdAsync(id);
            return new ContractResponse(){
                Id = contract.Id,
                Name = contract.Name,
                Price = contract.Price,
                Comment = contract.Comment,
                CreatedAt = $"{contract.CreatedAt.ToShortDateString()} {contract.CreatedAt.ToShortTimeString()}",
                IsActive = contract.IsActive,
                PostId = contract.PostId,
                PostContent = contract.Post.Content,
                PostTitle = contract.Post.Title,
                PostPrice = contract.Post.Price,
                CompanyId = contract.CompanyId,
                PostPhoto = contract.Post.Image is not null ? Convert.ToBase64String(contract.Post.Image) : string.Empty,
                PostCreatorPhoto = contract.Post.Creator.Avatar is not null ? Convert.ToBase64String(contract.Post.Creator.Avatar) : string.Empty,
                CompanyPhoto = contract.Company.Photo is not null ? Convert.ToBase64String(contract.Company.Photo) : string.Empty,
            };
        }

    }
}