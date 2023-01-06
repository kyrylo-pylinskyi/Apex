using Microsoft.AspNetCore.Mvc;
using Apex.Repository.Base;
using Microsoft.AspNetCore.Authorization;
using Apex.Models.RequestDto;
using static System.Net.Mime.MediaTypeNames;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PostController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserService _userService;
    private readonly IWebHostEnvironment _appEnvironment;

    public PostController(IUnitOfWork unitOfWork, IUserService userService, IWebHostEnvironment appEnvironment)
    {
        _unitOfWork = unitOfWork;
        _userService = userService;
        _appEnvironment = appEnvironment;
    }

    [HttpGet]
    [Route("{id}")]
    public async Task<IActionResult> GetPostById(int id)
    {
        var post = await _unitOfWork.PostRepository.GetPostById(id);
        if (post is null)
            return BadRequest("Post not found");

        return Ok(await _unitOfWork.PostRepository.GetPostById(id));
    }

    [HttpGet]
    [Route("feed")]
    public async Task<IActionResult> GetFeed()
    {
        return Ok(await _unitOfWork.PostRepository.GetPosts());
    }

    [HttpGet]
    [Route("my-post")]
    public async Task<IActionResult> GetMyPosts()
    {
        var userId = _userService.GetUserId();
        return Ok(await _unitOfWork.PostRepository.GetUserPosts(userId));
    }

    [HttpGet]
    [Route("user/{id}")]
    public async Task<IActionResult> GetUserPosts(int id)
    {
        return Ok(await _unitOfWork.PostRepository.GetUserPosts(id));
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> CreatePost([FromForm] PostRequest request)
    {
        var userEmail = _userService.GetUserEmail();
        var user = await _unitOfWork.UserRepository.FindByEmail(userEmail);

        var post = new Post
        {
            Title = request.Title,
            Content = request.Content,
            CreatedAt = DateTime.Now,
            CreatorId = user.Id,
        };

        if (request.FormFile is not null)
        {
            byte[] imageData = null;
            // считываем переданный файл в массив байтов
            using (var binaryReader = new BinaryReader(request.FormFile.OpenReadStream()))
            {
                imageData = binaryReader.ReadBytes((int)request.FormFile.Length);
            }
            // установка массива байтов
            post.Image = imageData;
        }

        await _unitOfWork.PostRepository.AddAsync(post);
        await _unitOfWork.CompleteAsync();

        return Ok($"Post {post.Title} created");
    }

    [HttpPut]
    [Route("edit/{id}")]
    public async Task<IActionResult> EditPost(int id, PostRequest request)
    {
        var userId = _userService.GetUserId();
        var post = await _unitOfWork.PostRepository.GetFirstAsync(p => p.Id == id);

        if (post.CreatorId != userId)
            return BadRequest("You can't edit post of another author");

        post.Title = request.Title;
        post.Content = request.Content;

        await _unitOfWork.CompleteAsync();

        return Ok($"Post {post.Title} changed");
    }

    [HttpDelete]
    [Route("delete/{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var userId = _userService.GetUserId();
        var post = await _unitOfWork.PostRepository.GetFirstAsync(p => p.Id == id);

        if (post.CreatorId != userId)
            return BadRequest("You can't delete post of another author");

        await _unitOfWork.PostRepository.DeleteAsync(post);
        await _unitOfWork.CompleteAsync();

        return Ok($"Post {post.Title} deleted");
    }
}
