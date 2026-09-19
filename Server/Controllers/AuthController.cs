using SubTrack.Authentication.Interfaces;
using Microsoft.AspNetCore.Mvc;
using SubTrack.Dtos.Auth;

namespace SubTrack.Authentication.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService authService;
        public AuthController(IAuthService _authService)
        {
            authService = _authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            var response = await authService.CreateNewUser(userRegisterDto);

            return Ok(response);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var response = await authService.AuthenticateUser(userLoginDto);

            return Ok(response);
        }

        [HttpGet("test")]
        public async Task<IActionResult> Test()
        {          

            return Ok("testing");
        }
    }
}
