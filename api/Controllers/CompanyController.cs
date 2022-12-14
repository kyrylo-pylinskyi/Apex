using Microsoft.AspNetCore.Mvc;
using Apex.Repository.Base;
using Apex.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.Dto;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CompanyController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;

    public CompanyController(IUnitOfWork unitOfWork, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _userService = userService;
    }

    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> GetCompanies()
    {
        var companies = await _unitOfWork.CompanyRepository.GetManyAsync();
        var employees = await _unitOfWork.EmployeeRepository.GetManyAsync();
        return Ok(await _unitOfWork.CompanyRepository.GetManyAsync());
    }

    [HttpGet]
    [Route("my-company")]
    public async Task<IActionResult> GetMyCompany()
    {
        var userId = _userService.GetUserId();
        return Ok(await _unitOfWork.CompanyRepository.GetFirstAsync(c => c.AdminId == userId));
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateCompany(CompanyDto request)
    {
        var userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByMail(userEmail);

        if(await _unitOfWork.CompanyRepository.UserHaveCompany(user.Id))
            return BadRequest("You already have registered company");
        if(await _unitOfWork.CompanyRepository.NameReserved(request.Name))
            return BadRequest("Company name reserved"); 
        if(await _unitOfWork.CompanyRepository.EmailReserved(request.Email))
            return BadRequest("Company email address reserved");
        if(await _unitOfWork.CompanyRepository.PhoneReserved(request.Phone))
            return BadRequest("Company phone number reserved");   

        var company = new Company
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            Location = request.Location,
            AdminId = user.Id
        };

        await _unitOfWork.CompanyRepository.AddAsync(company);
        await _unitOfWork.CompleteAsync();

        return Ok(company);
    }

    [HttpPut]
    [Route("edit")]
    public async Task<IActionResult> EditCompany(CompanyDto request)
    {
        var userId = _userService.GetUserId();
        var company = await _unitOfWork.CompanyRepository.GetFirstAsync(c => c.AdminId == userId);

        // if(await _unitOfWork.CompanyRepository.NameReserved(request.Name))
        //     return BadRequest("Company name reserved"); 
        // if(await _unitOfWork.CompanyRepository.EmailReserved(request.Email))
        //     return BadRequest("Company email address reserved");
        // if(await _unitOfWork.CompanyRepository.PhoneReserved(request.Phone))
        //     return BadRequest("Company phone number reserved"); 

        company.Name = request.Name;
        company.Email = request.Email;
        company.Phone = request.Phone;
        company.Location = request.Location;
        company.AdminId = userId;

        await _unitOfWork.CompleteAsync();

        return Ok(company);
    }

    [HttpDelete]
    [Route("delete")]
    public async Task<IActionResult>DeleteCompany()
    {
        var userId = _userService.GetUserId();
        var company = await _unitOfWork.CompanyRepository.GetFirstAsync(c => c.AdminId == userId);

        await _unitOfWork.EmployeeRepository.DeleteManyAsync(e => e.CompanyId == company.Id);    
        await _unitOfWork.CompanyRepository.DeleteAsync(company);
        await _unitOfWork.CompleteAsync();

        return Ok(company);
    }
}
