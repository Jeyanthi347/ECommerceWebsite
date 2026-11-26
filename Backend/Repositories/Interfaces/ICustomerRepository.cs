
using ECommerceAPI.Models;

namespace ECommerceAPI.Repositories.Interfaces
{
    public interface ICustomerRepository
    {
        Task<List<User>> GetCustomersAsync(
            string? search,
            int skip,
            int pageSize);

        Task<int> GetTotalCustomersCountAsync(string? search);

        Task<User?> GetCustomerByIdAsync(string customerId);

        Task<bool> UpdateCustomerAsync(User customer);
    }
}
