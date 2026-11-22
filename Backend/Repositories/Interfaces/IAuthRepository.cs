
using ECommerceAPI.Models;
using Microsoft.AspNetCore.Identity;

namespace ECommerceAPI.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByEmailAsync(string email);

        Task<IdentityResult> CreateUserAsync(User user, string password);

        Task<bool> CheckPasswordAsync(User user, string password);

        Task<IList<string>> GetUserRolesAsync(User user);

        Task<IdentityResult> AddToRoleAsync(User user, string role);
    }
}
