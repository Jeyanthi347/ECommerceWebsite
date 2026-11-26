
using ECommerceAPI.DTOs.Customer;
using ECommerceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "AdminOnly")]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<IActionResult> GetAllCustomers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null)
        {
            var customers = await _customerService.GetAllCustomersAsync(
                pageNumber, pageSize, search);

            return Ok(customers);
        }

        // GET: api/Customer/{customerId}
        [HttpGet("{customerId}")]
        public async Task<IActionResult> GetCustomerById(string customerId)
        {
            var customer =
                await _customerService.GetCustomerByIdAsync(customerId);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Customer not found."
                });
            }

            return Ok(customer);
        }

        // PUT: api/Customer/{customerId}/status
        [HttpPut("{customerId}/status")]
        public async Task<IActionResult> UpdateCustomerStatus(
            string customerId,
            [FromBody] UpdateCustomerStatusDto dto)
        {
            var result = await _customerService.UpdateCustomerStatusAsync(
                customerId, dto.IsActive);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Customer not found or status was not updated."
                });
            }

            string message = dto.IsActive
                ? "Customer account activated successfully."
                : "Customer account deactivated successfully.";

            return Ok(new
            {
                message,
                isActive = dto.IsActive
            });
        }
    }
}
