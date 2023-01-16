using Microsoft.AspNetCore.Mvc;
using Apex.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.RequestDto;

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
    [Route("{id}")]
    public async Task<IActionResult> GetCompanyById(int id)
    {
        return Ok(await _unitOfWork.CompanyRepository.GetCompanyById(id));
    }

    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> GetCompanies()
    {
        return Ok(await _unitOfWork.CompanyRepository.GetCompanies());
    }

    [HttpGet]
    [Route("my-company")]
    public async Task<IActionResult> GetMyCompany()
    {
        var userId = _userService.GetUserId();
        return Ok(await _unitOfWork.CompanyRepository.FindByAdminId(userId));
    }

    [HttpGet]
    [Route("user/{id}")]
    public async Task<IActionResult> GetUserCompany(int id)
    {
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(id);
        if(company is null)
            return BadRequest("Company not found");
        return Ok(company);
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateCompany([FromForm] CompanyRequest request)
    {
        var userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);

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
            AdminId = user.Id,
            About = request.About,
            Website = request.Website
        };

        if (request.Photo is not null)
        {
            byte[] imageData = null;
            // считываем переданный файл в массив байтов
            using (var binaryReader = new BinaryReader(request.Photo.OpenReadStream()))
            {
                imageData = binaryReader.ReadBytes((int)request.Photo.Length);
            }
            // установка массива байтов
            company.Photo = imageData;
        }

        await _unitOfWork.CompanyRepository.AddAsync(company);
        await _unitOfWork.CompleteAsync();

        return Ok($"Company {company.Name} created");
    }

    [HttpPut]
    [Route("edit")]
    public async Task<IActionResult> EditCompany([FromForm] CompanyRequest request)
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
        company.About = request.About;
        company.Website = request.Website;

        if (request.Photo is not null)
        {
            byte[] imageData = null;
            // считываем переданный файл в массив байтов
            using (var binaryReader = new BinaryReader(request.Photo.OpenReadStream()))
            {
                imageData = binaryReader.ReadBytes((int)request.Photo.Length);
            }
            // установка массива байтов
            company.Photo = imageData;
        }

        await _unitOfWork.CompleteAsync();

        return Ok($"Company {company.Name} data updated");
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

        return Ok($"Company {company.Name} deleted");
    }
}
