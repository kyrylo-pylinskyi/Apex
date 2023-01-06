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
public class ProfileController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;

    public ProfileController(IUnitOfWork unitOfWork, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _userService = userService;
    }

    [HttpPut]
    [Authorize]
    [Route("edit")]
    public async Task<IActionResult> ChangeProfileData([FromForm] ChangeProfileRequest request){
        string userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);
        user.Name = request.Name;
        user.Phone = request.Phone;

        if (request.FormFile is not null)
        {
            byte[] imageData = null;
            // считываем переданный файл в массив байтов
            using (var binaryReader = new BinaryReader(request.FormFile.OpenReadStream()))
            {
                imageData = binaryReader.ReadBytes((int)request.FormFile.Length);
            }
            // установка массива байтов
            user.Avatar = imageData;
        }

        await _unitOfWork.CompleteAsync();
        return Ok($"User {user.Email} updated");
    }

}
