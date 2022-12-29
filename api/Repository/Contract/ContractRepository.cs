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
            var contracts = await GetManyAsync();
            return contracts.Select(c => new ContractResponse(){
                Id = c.Id,
                Name = c.Name,
                CreatedAt = c.CreatedAt,
                IsActive = c.IsActive,
                PostId = c.PostId,
                CompanyId = c.CompanyId
            });
        }

        public async Task<IEnumerable<ContractResponse>> GetCompanyContracts(int companyId){
            var contracts = await GetManyAsync(c => c.CompanyId == companyId);
            return contracts.Select(c => new ContractResponse(){
                Id = c.Id,
                Name = c.Name,
                CreatedAt = c.CreatedAt,
                IsActive = c.IsActive,
                PostId = c.PostId,
                CompanyId = c.CompanyId
            });
        }

        public async Task<IEnumerable<ContractResponse>> GetUserContracts(int userId){
            var contracts = await GetManyAsync(c => c.Post.CreatorId == userId);
            return contracts.Select(c => new ContractResponse(){
                Id = c.Id,
                Name = c.Name,
                CreatedAt = c.CreatedAt,
                IsActive = c.IsActive,
                PostId = c.PostId,
                CompanyId = c.CompanyId
            });
        }

        public async Task<ContractResponse> GetContractById(int id){
            var contract = await GetByIdAsync(id);
            return new ContractResponse(){
                Id = contract.Id,
                Name = contract.Name,
                CreatedAt = contract.CreatedAt,
                IsActive = contract.IsActive,
                PostId = contract.PostId,
                CompanyId = contract.CompanyId
            };
        }

    }
}