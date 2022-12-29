using System.Linq.Expressions;
using Apex.Models.ResponseDto;
using Apex.Repository.Base;

namespace Apex.Repository.ContractRepo
{
    public interface IContractRepository : IBaseRepository<Contract>
    {
        Task<ContractResponse> GetContractById(int id);
        Task<IEnumerable<ContractResponse>> GetCompanyContracts(int companyId);
        Task<IEnumerable<ContractResponse>> GetUserContracts(int userId);
        Task<IEnumerable<ContractResponse>> GetContracts();
    }
}