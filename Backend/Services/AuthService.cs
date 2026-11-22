
using ECommerceAPI.DTOs.Auth;
using ECommerceAPI.Models;
using ECommerceAPI.Helpers;
using ECommerceAPI.Repositories.Interfaces;
using ECommerceAPI.Services.Interfaces;

namespace ECommerceAPI.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtHelper _jwtHelper;

        public AuthService(
            IAuthRepository authRepository,
            JwtHelper jwtHelper)
        {
            _authRepository = authRepository;
            _jwtHelper = jwtHelper;
        }

        public async Task<string> RegisterAsync(RegisterRequestDto request)
        {
            var existingUser = await _authRepository.GetUserByEmailAsync(request.Email);

            if (existingUser != null)
            {
                return "Email already registered.";
            }

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                UserName = request.Email,
                PhoneNumber = request.PhoneNumber,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            var result = await _authRepository.CreateUserAsync(user, request.Password);

            if (!result.Succeeded)
            {
                return string.Join(", ", result.Errors.Select(error => error.Description));
            }

            var roleResult = await _authRepository.AddToRoleAsync(user, "Customer");

            if (!roleResult.Succeeded)
            {
                return "User created, but role assignment failed.";
            }

            return "Registration successful.";
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
        {
            var user = await _authRepository.GetUserByEmailAsync(request.Email);

            if (user == null || !user.IsActive)
            {
                return null;
            }

            var isPasswordValid = await _authRepository.CheckPasswordAsync(
                user, request.Password);

            if (!isPasswordValid)
            {
                return null;
            }

            var token = await _jwtHelper.GenerateTokenAsync(user);

            var roles = await _authRepository.GetUserRolesAsync(user);

            return new AuthResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email!,
                AccessToken = token,
                ExpiresAt = DateTime.UtcNow.AddMinutes(60),
                Roles = roles.ToList()
            };
        }
    }
}
