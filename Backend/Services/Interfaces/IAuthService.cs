
using ECommerceAPI.DTOs.Auth;

namespace ECommerceAPI.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequestDto request);

        Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
    }
}
