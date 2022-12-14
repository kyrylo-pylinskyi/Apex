using Microsoft.AspNetCore.Mvc;
using Apex.Repository.Base;
using Apex.Models.Requests;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.Dto;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;

    public PostController(IUnitOfWork unitOfWork, IUserService userService)
    {
        _unitOfWork = unitOfWork;
        _userService = userService;
    }

    [HttpGet]
    [Route("feed")]
    public async Task<IActionResult> GetFeed()
    {
        return Ok(await _unitOfWork.PostRepository.GetManyAsync());
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreatePost(PostDto request)
    {
        var userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByMail(userEmail);
        var post = new Post
        {
            Title = request.Title,
            Content = request.Content,
            CreatedAt = DateTime.Now,
            CreatorId = user.Id,
            Creator = user
        };

        await _unitOfWork.PostRepository.AddAsync(post);
        await _unitOfWork.CompleteAsync();

        return Ok(post);
    }

    [HttpPut]
    [Route("edit/{id}")]
    public async Task<IActionResult> EditPost(int id, PostDto request)
    {
        var userId = _userService.GetUserId();
        var post = await _unitOfWork.PostRepository.GetFirstAsync(p => p.Id == id);

        if(post.CreatorId != userId)
            return BadRequest("You can't edit post of another author");

        post.Title = request.Title;
        post.Content = request.Content;

        await _unitOfWork.CompleteAsync();

        return Ok(post);
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult>DeletePost(int id)
    {
        var userId = _userService.GetUserId();
        var post = await _unitOfWork.PostRepository.GetFirstAsync(p => p.Id == id);

        if(post.CreatorId != userId)
            return BadRequest("You can't delete post of another author");

        await _unitOfWork.PostRepository.DeleteAsync(post);
        await _unitOfWork.CompleteAsync();

        return Ok(post);
    }
}
