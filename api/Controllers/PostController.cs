using Microsoft.AspNetCore.Mvc;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetFeed()
    {
        return Ok("Home Controller");
    }
}
