
using System.Security.Claims;
using ECommerceAPI.DTOs.Order;
using ECommerceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        // Place a new order (Customer)
        [HttpPost]
        [Authorize(Policy = "CustomerOnly")]
        public async Task<IActionResult> PlaceOrder(
            [FromBody] CreateOrderDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user token."
                    });
                }

                var order = await _orderService.PlaceOrderAsync(userId, dto);

                return CreatedAtAction(
                    nameof(GetMyOrderById),
                    new { orderId = order.OrderId },
                    new
                    {
                        message = "Order placed successfully.",
                        order
                    });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Get logged-in customer's orders
        [HttpGet("my-orders")]
        [Authorize(Policy = "CustomerOnly")]
        public async Task<IActionResult> GetMyOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user token."
                    });
                }

                var orders = await _orderService.GetMyOrdersAsync(
                    userId,
                    pageNumber,
                    pageSize);

                return Ok(orders);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Get one order belonging to logged-in customer
        [HttpGet("my-orders/{orderId:int}")]
        [Authorize(Policy = "CustomerOnly")]
        public async Task<IActionResult> GetMyOrderById(int orderId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "Invalid user token."
                    });
                }

                var order = await _orderService.GetOrderByIdAsync(
                    orderId,
                    userId);

                return Ok(order);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // Get all orders (Admin)
        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAllOrders(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var orders = await _orderService.GetAllOrdersAsync(
                    pageNumber,
                    pageSize);

                return Ok(orders);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Update order status (Admin)
        [HttpPut("{orderId:int}/status")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> UpdateOrderStatus(
            int orderId,
            [FromBody] UpdateOrderStatusDto dto)
        {
            try
            {
                var order = await _orderService.UpdateOrderStatusAsync(
                    orderId,
                    dto);

                return Ok(new
                {
                    message = "Order status updated successfully.",
                    order
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
