
using ECommerceAPI.DTOs.Customer;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using ECommerceAPI.Services.Interfaces;

namespace ECommerceAPI.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        // Get All Customers
        public async Task<CustomerListResponseDto> GetAllCustomersAsync(
            int pageNumber,
            int pageSize,
            string? search)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }

            if (pageSize < 1)
            {
                pageSize = 10;
            }

            if (pageSize > 100)
            {
                pageSize = 100;
            }

            int skip = (pageNumber - 1) * pageSize;

            var customers = await _customerRepository.GetCustomersAsync(
                search, skip, pageSize);

            int totalRecords =
                await _customerRepository.GetTotalCustomersCountAsync(search);

            int totalPages = (int)Math.Ceiling(
                (double)totalRecords / pageSize);

            return new CustomerListResponseDto
            {
                Customers = customers.Select(MapToResponseDto).ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }

        // Get Customer By ID
        public async Task<CustomerResponseDto?> GetCustomerByIdAsync(
            string customerId)
        {
            var customer =
                await _customerRepository.GetCustomerByIdAsync(customerId);

            if (customer == null)
            {
                return null;
            }

            return MapToResponseDto(customer);
        }

        // Update Customer Status
        public async Task<bool> UpdateCustomerStatusAsync(
            string customerId,
            bool isActive)
        {
            var customer =
                await _customerRepository.GetCustomerByIdAsync(customerId);

            if (customer == null)
            {
                return false;
            }

            customer.IsActive = isActive;

            return await _customerRepository.UpdateCustomerAsync(customer);
        }

        // Map User to Customer Response DTO
        private static CustomerResponseDto MapToResponseDto(User customer)
        {
            return new CustomerResponseDto
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Email = customer.Email ?? string.Empty,
                PhoneNumber = customer.PhoneNumber,
                IsActive = customer.IsActive,
                CreatedAt = customer.CreatedAt
            };
        }
    }
}
