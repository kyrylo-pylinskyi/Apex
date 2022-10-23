using Microsoft.AspNetCore.Mvc;
using Apex.Repository;
using Apex.Models.Dto;
using Apex.Models;
using System.Security.Cryptography;
using Apex.Service.MailService;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMailService _mailService;

    public AuthController(IUnitOfWork unitOfWork, IMailService mailService)
    {
        _unitOfWork = unitOfWork;
        _mailService = mailService;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(UserDto userDto)
    {
        if (_unitOfWork.UserRepository.MailReserved(userDto.Mail))
            return BadRequest("Email Reserved");

        CreatePasswordHash(userDto.Password, out byte[] passwordHash, out byte[] passwordSalt);

        var user = new User
        {
            Name = userDto.Name,
            Mail = userDto.Mail,
            Phone = userDto.Phone,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsActive = false,
            CreatedAt = DateTime.Now,
            EmailCode = GenerateEmailCode(),
            Role = Role.Client,
        };

        var email = new EmailDto
        {
            To = user.Mail,
            Subject = "Apex Email Verification Code",
            Body = $"Your Verifification Code {user.EmailCode}"
        };

        _mailService.SendMail(email);

        await _unitOfWork.UserRepository.AddAsync(user);
        await _unitOfWork.CompleteAsync();

        return Ok(user);
    }

    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
    private string GenerateEmailCode()
    {
        var chars = "0123456789";
        var stringChars = new char[6];
        var random = new Random();

        for (int i = 0; i < stringChars.Length; i++)
        {
            stringChars[i] = chars[random.Next(chars.Length)];
        }

        return new String(stringChars);
    }

}
