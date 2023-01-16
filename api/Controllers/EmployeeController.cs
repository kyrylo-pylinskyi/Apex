using Microsoft.AspNetCore.Mvc;
using Apex.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.RequestDto;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeeController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;

    public EmployeeController(IUnitOfWork unitOfWork, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _userService = userService;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetEmployeeById(int id)
    {
        return Ok(await _unitOfWork.EmployeeRepository.GetEmployeeById(id));
    }

    [HttpGet]
    [Route("list")]
    public async Task<IActionResult> GetEmployees()
    {
        return Ok(await _unitOfWork.EmployeeRepository.GetEmployees());
    }

    [HttpGet]
    [Route("my-employees")]
    public async Task<IActionResult> GetMyEmployees()
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        var companyId = Convert.ToInt32(company.Id);
        var employees = await _unitOfWork.EmployeeRepository.GetCompanyEmployees(companyId);

        return Ok(employees);
    }

    [HttpGet]
    [Route("company/{id}")]
    public async Task<IActionResult> GetCompanyEmployees(int id)
    {
        var company = await _unitOfWork.CompanyRepository.GetByIdAsync(id);

        var companyId = Convert.ToInt32(company.Id);

        var employees = await _unitOfWork.EmployeeRepository.GetCompanyEmployees(companyId);

        return Ok(employees);
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateEmployee([FromForm] EmployeeRequest request)
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        if (company is null)
            return BadRequest("You must register a company to create employees");

        var employee = new Employee
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            FullName = $"{request.FirstName} {request.LastName}",
            BirthDate = request.BirthDate,
            Email = request.Email,
            Phone = request.Phone,
            Job = request.Job,
            EmployedAt = request.EmployedAt,
            CompanyId = Convert.ToInt32(company.Id),
            Salary = request.Salary
        };

        if (request.Avatar is not null)
        {
            byte[] imageData = null;
            // считываем переданный файл в массив байтов
            using (var binaryReader = new BinaryReader(request.Avatar.OpenReadStream()))
            {
                imageData = binaryReader.ReadBytes((int)request.Avatar.Length);
            }
            // установка массива байтов
            employee.Photo = imageData;
        }



        await _unitOfWork.EmployeeRepository.AddAsync(employee);
        await _unitOfWork.CompleteAsync();

        return Ok($"Employee {employee.FullName} Added to company {company.Name}");
    }

    [HttpPut]
    [Route("edit")]
    public async Task<IActionResult> EditEmployee([FromForm] EmployeeRequest request)
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        var employee = await _unitOfWork.EmployeeRepository.GetFirstAsync(e => e.Id == request.Id);

        employee.FirstName = request.FirstName;
        employee.LastName = request.LastName;
        employee.FullName = $"{request.FirstName} {request.LastName}";
        employee.Email = request.Email;
        employee.Phone = request.Phone;
        employee.BirthDate = request.BirthDate;
        employee.Job = request.Job;
        employee.EmployedAt = request.EmployedAt;
        employee.Salary = request.Salary;

        if (request.Avatar is not null)
        {
            byte[] imageData = null;
            // считываем переданный файл в массив байтов
            using (var binaryReader = new BinaryReader(request.Avatar.OpenReadStream()))
            {
                imageData = binaryReader.ReadBytes((int)request.Avatar.Length);
            }
            // установка массива байтов
            employee.Photo = imageData;
        }

        await _unitOfWork.CompleteAsync();

        return Ok($"Employee {employee.FullName} data updated successfully");
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> DeleteEmployee(int id)
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        var employee = await _unitOfWork.EmployeeRepository.GetFirstAsync(e => e.Id == id);

        await _unitOfWork.EmployeeRepository.DeleteAsync(employee);
        await _unitOfWork.CompleteAsync();

        return Ok($"Employee {employee.FullName} deleted");
    }
}
