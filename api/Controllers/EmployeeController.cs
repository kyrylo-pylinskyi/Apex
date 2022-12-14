using Microsoft.AspNetCore.Mvc;
using Apex.Repository.Base;
using Apex.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.Dto;

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
    [Route("list")]
    public async Task<IActionResult> GetEmployees()
    {
        return Ok(await _unitOfWork.EmployeeRepository.GetManyAsync());
    }

    [HttpGet]
    [Route("my-employees")]
    public async Task<IActionResult> GetMyEmployees()
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByMail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        var employees = await _unitOfWork.EmployeeRepository.GetCompanyEmployees(company.Id);

        return Ok(employees.ToList());
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreateEmployee(EmployeeDto request)
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByMail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        if (company is null)
            return BadRequest("You must register a company to create employees");

        var employee = new Employee{
            FirstName = request.FirstName,
            LastName = request.LastName,
            FullName = $"{request.FirstName} {request.LastName}",
            BirthDate = request.BirthDate,
            Job = request.Job,
            EmployedAt = request.EmployedAt,
            CompanyId = company.Id,
            Company = company
        };

        await _unitOfWork.EmployeeRepository.AddAsync(employee);
        await _unitOfWork.CompleteAsync();

        return Ok($"Employee {employee.FullName} Added to company {company.Name}");
    }

    [HttpPut]
    [Route("edit/{id}")]
    public async Task<IActionResult> EditEmployee(int id, EmployeeDto request)
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByMail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        var employee = await _unitOfWork.EmployeeRepository.GetFirstAsync(e => e.Id == id);

        if(company.Id != employee.CompanyId)
            return BadRequest("You can't edit employee of another company");

        employee.FirstName = request.FirstName;
        employee.LastName = request.LastName;
        employee.FullName = $"{request.FirstName} {request.LastName}";
        employee.BirthDate = request.BirthDate;
        employee.Job = request.Job;
        employee.EmployedAt = request.EmployedAt;

        var employees = await _unitOfWork.EmployeeRepository.GetCompanyEmployees(company.Id);
        company.Employees = employees.ToList();

        await _unitOfWork.CompleteAsync();
        
        return Ok($"Employee {employee.FullName} Info updated successfully");
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult>DeleteEmployee(int id)
    {
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByMail(userEmail);
        var company = await _unitOfWork.CompanyRepository.FindByAdminId(user.Id);

        var employee = await _unitOfWork.EmployeeRepository.GetFirstAsync(e => e.Id == id);

        if(company.Id != employee.Id)
            return BadRequest("You can't delete employee of another company");

        await _unitOfWork.EmployeeRepository.DeleteAsync(employee);
        await _unitOfWork.CompleteAsync();
        
        return Ok($"Employee {employee.FullName} deleted");
    }
}
