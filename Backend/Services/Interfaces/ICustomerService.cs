
using ECommerceAPI.DTOs.Customer;

namespace ECommerceAPI.Services.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerListResponseDto> GetAllCustomersAsync(
            int pageNumber,
            int pageSize,
            string? search);

        Task<CustomerResponseDto?> GetCustomerByIdAsync(
            string customerId);

        Task<bool> UpdateCustomerStatusAsync(
            string customerId,
            bool isActive);
    }
}
