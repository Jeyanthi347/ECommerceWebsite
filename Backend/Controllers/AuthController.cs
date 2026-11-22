
using ECommerceAPI.DTOs.Auth;
using ECommerceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        // POST: api/Auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);

            if (result == "Email already registered.")
            {
                return Conflict(new
                {
                    message = result
                });
            }

            if (result != "Registration successful.")
            {
                return BadRequest(new
                {
                    message = result
                });
            }

            return StatusCode(201, new
            {
                message = result
            });
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);

            if (result == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            return Ok(result);
        }

        // GET: api/Auth/profile
        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetProfile()
        {
            return Ok(new
            {
                UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
                FullName = User.FindFirstValue(ClaimTypes.Name),
                Email = User.FindFirstValue(ClaimTypes.Email),
                Role = User.FindFirstValue(ClaimTypes.Role)
            });
        }
    }
}
