using Microsoft.AspNetCore.Mvc;
using Apex.Repository.Base;
using Apex.Models.Dto;
using Apex.Models;
using System.Security.Cryptography;
using Apex.Service.MailService;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.Requests;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMailService _mailService;
    private readonly IUserService _userService;

    public AuthController(IUnitOfWork unitOfWork, IMailService mailService, IConfiguration configuration, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _mailService = mailService;
        _configuration = configuration;
        _userService = userService;
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _unitOfWork.UserRepository.MailReserved(request.Email))
            return BadRequest("Email Reserved");

        CreatePasswordHash(request.Password,
                        out byte[] passwordHash,
                        out byte[] passwordSalt);

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsActive = false,
            CreatedAt = DateTime.Now,
            VerificationToken = CreateRandomToken(),
            Role = Roles.Client,
        };

        await _unitOfWork.UserRepository.AddAsync(user);
        await _unitOfWork.CompleteAsync();

        var message = new EmailDto
        {
            To = user.Email,
            Subject = "Apex Email Verification Code",
            Body = $"<h2> Hello {user.Name}</h2>" + 
                    "<p>You can actvate you Apex account with this link</p>" +
                    $"<b>{user.VerificationToken}</b><br/>" +
                    $"<a href=\"https://localhost:3000/confirm-email/{user.VerificationToken}\">" + 
                    "Verify </a>"
        };

        _mailService.SendMail(message);

        return Ok(user);
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<string>> Login(LoginRequest request)
    {
        var user = await _unitOfWork.UserRepository.FindByMail(request.Email);
        if (user is null)
            return BadRequest("User not found.");

        if (!user.IsActive || user.VerifiedAt is null)
            return BadRequest("Email address is not activated");

        if (!VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt))
            return BadRequest("Wrong password.");

        string token = CreateToken(user);

        return Ok(token);
    }

    [HttpPost]
    [Route("verify-email/{token}")]
    public async Task<IActionResult> Verify(string token)
    {
        var user = await _unitOfWork.UserRepository.FindByToken(token);
        if (user is null)
            return BadRequest("Invalid token");

        user.IsActive = true;
        user.VerifiedAt = DateTime.Now;
        user.VerificationToken = null;
        await _unitOfWork.CompleteAsync();

        return Ok($"email address: {user.Email} - verified");
    }

    [HttpPost]
    [Route("forgot-password")]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var user = await _unitOfWork.UserRepository.FindByMail(email);

        if (user is null)
            return BadRequest("User not found");

        user.PasswordResetToken = CreateRandomToken();
        user.ResetTokenExpires = DateTime.Now.AddDays(1);
        await _unitOfWork.CompleteAsync();

        var message = new EmailDto
        {
            To = user.Email,
            Subject = "Apex Email Verification Code",
            Body = $"Your Reset Password Token: <br> {user.PasswordResetToken}"
        };

        _mailService.SendMail(message);

        return Ok($"You may now reset your password.");
    }

    [HttpPost]
    [Route("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        var user = await _unitOfWork.UserRepository.FindByResetPasswordToken(request.Token);
        if (user is null || user.ResetTokenExpires < DateTime.Now)
            return BadRequest("Invalid Token.");
        
        CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;
        user.PasswordResetToken = null;
        user.ResetTokenExpires = null;

        await _unitOfWork.CompleteAsync();

        return Ok("Password successfully reset.");
    }

    [HttpPost]
    [Authorize]
    [Route("get-me")]
    public ActionResult GetMe() => Ok(_userService.GetMe());


    private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }

    private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
    {
        using (var hmac = new HMACSHA512(passwordSalt))
        {
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(passwordHash);
        }
    }

    private string CreateRandomToken() =>
        Convert.ToHexString(RandomNumberGenerator.GetBytes(8));

    private string CreateToken(User user)
    {
        List<Claim> claims = new List<Claim>
            {
                new Claim("user_id", user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
                new Claim(ClaimTypes.MobilePhone, user.Phone),
                new Claim(ClaimTypes.Email, user.Email)
            };

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
            _configuration.GetSection("AppSettings:Token").Value));

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        var jwt = new JwtSecurityTokenHandler().WriteToken(token);

        return jwt;
    }

}
