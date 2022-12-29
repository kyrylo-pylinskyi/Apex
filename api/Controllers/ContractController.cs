using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ContractController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;

    public ContractController(IUnitOfWork unitOfWork, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _userService = userService;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetContractById(int id)
    {
        return Ok(await _unitOfWork.ContractRepository.GetContractById(id));
    }

    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> GetContracts()
    {
        return Ok(await _unitOfWork.ContractRepository.GetContracts());
    }

    [HttpGet]
    [Route("my-contracts")]
    public async Task<IActionResult> GetMyContracts()
    {
        var userId = _userService.GetUserId();
        return Ok(await _unitOfWork.ContractRepository.GetUserContracts(userId));
    }

    [HttpGet]
    [Route("user/{id}")]
    public async Task<IActionResult> GetMyContracts(int id)
    {
        return Ok(await _unitOfWork.ContractRepository.GetUserContracts(id));
    }

    [HttpGet]
    [Route("my-company-contracts")]
    public async Task<IActionResult> GetMyComapanyContracts()
    {
        var userId = _userService.GetUserId();
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(userId);
        var companyId = Convert.ToInt32(company.Id);
        return Ok(await _unitOfWork.ContractRepository.GetCompanyContracts(companyId));
    }

    [HttpGet]
    [Route("company/{id}")]
    public async Task<IActionResult> GetComapanyContracts(int id)
    {
        return Ok(await _unitOfWork.ContractRepository.GetCompanyContracts(id));
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateContract(int postId)
    {
        var userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);
        var post = await _unitOfWork.PostRepository.GetFirstAsync(p => p.Id == postId);
        var author = await _unitOfWork.UserRepository.GetByIdAsync(post.CreatorId);

        var contract = new Contract{
            Name = $"{post.Title} Contract between {company.Name} and {author.Name}",
            CreatedAt = DateTime.Now,
            IsActive = false,
            PostId = postId,
            CompanyId = Convert.ToInt32(company.Id)
        };

        await _unitOfWork.ContractRepository.AddAsync(contract);
        await _unitOfWork.CompleteAsync();

        return Ok(contract);
    }

    [HttpPut]
    [Route("activate/{id}")]
    public async Task<IActionResult> ActivateContract(int id)
    {
        var contract = await _unitOfWork.ContractRepository.GetByIdAsync(id);
        contract.IsActive = true;
        await _unitOfWork.CompleteAsync();

        return Ok();
    }

    [HttpPut]
    [Route("deactivate/{id}")]
    public async Task<IActionResult> DeactivateContract(int id)
    {
        var contract = await _unitOfWork.ContractRepository.GetByIdAsync(id);
        contract.IsActive = false;
        await _unitOfWork.CompleteAsync();

        return Ok();
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult>DeleteContract(int id)
    {
        var contract = await _unitOfWork.ContractRepository.GetByIdAsync(id);
        await _unitOfWork.ContractRepository.DeleteAsync(contract);
        await _unitOfWork.CompleteAsync();
        return Ok();
    }
}
