using Microsoft.AspNetCore.Mvc;

namespace Apex.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok("Home Controller");
    }
}
