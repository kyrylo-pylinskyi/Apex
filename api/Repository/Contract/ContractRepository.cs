using System.Linq.Expressions;
using Apex.Repository.Base;

namespace Apex.Repository.ContractRepo
{
    public class ContractRepository : BaseRepository<Contract>, IContractRepository
    {
        public ContractRepository(AppDbContext context) : base(context)
        {
        }

    }
}