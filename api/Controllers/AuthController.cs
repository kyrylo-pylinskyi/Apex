using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.RequestDto;
using Apex.Models.ResponseDto;

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

    [HttpGet]
    [Route("mail-valid/{email}")]
    public async Task<IActionResult> IsMailReserved(string email)
    {
        bool reserved = await _unitOfWork.UserRepository.MailReserved(email);
        if (reserved)
            return Ok(false);
        return Ok(true);
    }

    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        if (await _unitOfWork.UserRepository.MailReserved(request.Email))
            return Ok("Email address Reserved");

        CreateHash(request.Password,
                        out byte[] passwordHash,
                        out byte[] passwordSalt);

        var verificationToken = CreateRandomToken();
        CreateHash(verificationToken,
                        out byte[] verificationTokenHash,
                        out byte[] verificationTokenSalt);

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            Phone = request.Phone,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            IsActive = false,
            CreatedAt = DateTime.Now,
            VerificationTokenHash = verificationTokenHash,
            VerificationTokenSalt = verificationTokenSalt,
            Role = Roles.Client,
        };

        await _unitOfWork.UserRepository.AddAsync(user);
        await _unitOfWork.CompleteAsync();

        var message = new EmailRequest
        {
            To = user.Email,
            Subject = "Apex Email Verification Code",
            Body = $"<h2> Hello {user.Name}</h2>" +
                    "<p>You can actvate you Apex account with this token</p>" +
                    $"<b>{verificationToken}</b><br/>"
        };

        _mailService.SendMail(message);

        return Ok($"User {user.Name} registered");
    }

    [HttpPost]
    [Route("login")]
    public async Task<ActionResult<string>> Login(LoginRequest request)
    {
        var user = await _unitOfWork.UserRepository.FindByEmail(request.Email);
        if (user is null)
            return BadRequest("User not found.");

        if (!user.IsActive || user.VerifiedAt is null)
            return BadRequest("Email address is not activated");

        if (!VerifyHash(request.Password, user.PasswordHash, user.PasswordSalt))
            return BadRequest("Wrong password.");

        string token = CreateToken(user);

        return Ok(token);
    }

    [HttpPost]
    [Route("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromForm] VerifyEmailRequest request)
    {
        var user = await _unitOfWork.UserRepository.FindByEmail(request.Email);
        var tokenValid = VerifyHash(request.Token, user.VerificationTokenHash, user.VerificationTokenSalt);
        if (!tokenValid)
            return BadRequest("Invalid token");

        user.IsActive = true;
        user.VerifiedAt = DateTime.Now;
        user.VerificationTokenSalt = null;
        user.VerificationTokenHash = null;
        await _unitOfWork.CompleteAsync();

        return Ok($"email address: {user.Email} - verified");
    }

    [HttpPost]
    [Route("forgot-password/{email}")]
    public async Task<IActionResult> ForgotPassword(string email)
    {
        var user = await _unitOfWork.UserRepository.FindByEmail(email);

        if (user is null)
            return BadRequest("User not found");

        var passwordResetToken = CreateRandomToken();
        CreateHash(passwordResetToken, out byte[] passwordResetTokenHash, out byte[] passwordResetTokenSalt);

        user.PasswordResetTokenSalt = passwordResetTokenSalt;
        user.PasswordResetTokenHash = passwordResetTokenHash;
        user.ResetTokenExpires = DateTime.Now.AddDays(1);
        await _unitOfWork.CompleteAsync();

        var message = new EmailRequest
        {
            To = user.Email,
            Subject = "Apex Email Verification Code",
            Body = $"Your Reset Password Token: <br> {passwordResetToken}"
        };

        _mailService.SendMail(message);

        return Ok($"We sent reset password token to your mail box. You may now reset your password.");
    }

    [HttpPut]
    [Route("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        var user = await _unitOfWork.UserRepository.FindByEmail(request.Email);
        if (user is null || user.ResetTokenExpires < DateTime.Now)
            return BadRequest("Invalid Token.");

        CreateHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;
        user.PasswordResetTokenHash = null;
        user.PasswordResetTokenSalt = null;
        user.ResetTokenExpires = null;

        await _unitOfWork.CompleteAsync();

        return Ok("Password successfully reset.");
    }

    [HttpGet]
    [Authorize]
    [Route("get-me")]
    public async Task<ActionResult> GetMe()
    {
        var userId = _userService.GetUserId();
        var user = await _unitOfWork.UserRepository.GetUserDetails(userId);
        return Ok(user);
    }


    private void CreateHash(string value, out byte[] hash, out byte[] salt)
    {
        using (var hmac = new HMACSHA512())
        {
            salt = hmac.Key;
            hash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(value));
        }
    }
    private bool VerifyHash(string value, byte[] hash, byte[] salt)
    {
        using (var hmac = new HMACSHA512(salt))
        {
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(value));
            return computedHash.SequenceEqual(hash);
        }
    }

    private byte[] GetHash(string value, byte[] salt)
    {
        using (var hmac = new HMACSHA512(salt))
        {
            var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(value));
            return computedHash;
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
