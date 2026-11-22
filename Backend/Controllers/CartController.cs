
using ECommerceAPI.DTOs.Cart;
using ECommerceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Policy = "CustomerOnly")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // Get customer's cart
        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "User not authenticated."
                    });
                }

                var cart = await _cartService.GetCartAsync(userId);

                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = ex.Message
                });
            }
        }

        // Add product to cart
        [HttpPost("items")]
        public async Task<IActionResult> AddToCart(AddToCartDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "User not authenticated."
                    });
                }

                var cart = await _cartService.AddToCartAsync(userId, dto);

                return Ok(new
                {
                    message = "Product added to cart successfully.",
                    cart
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Update cart item quantity
        [HttpPut("items/{cartItemId}")]
        public async Task<IActionResult> UpdateCartItem(
            int cartItemId,
            UpdateCartItemDto dto)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "User not authenticated."
                    });
                }

                var cart = await _cartService.UpdateCartItemAsync(
                    userId,
                    cartItemId,
                    dto);

                return Ok(new
                {
                    message = "Cart item quantity updated successfully.",
                    cart
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Remove item from cart
        [HttpDelete("items/{cartItemId}")]
        public async Task<IActionResult> RemoveCartItem(int cartItemId)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "User not authenticated."
                    });
                }

                var cart = await _cartService.RemoveCartItemAsync(
                    userId,
                    cartItemId);

                return Ok(new
                {
                    message = "Cart item removed successfully.",
                    cart
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // Clear cart
        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new
                    {
                        message = "User not authenticated."
                    });
                }

                var cart = await _cartService.ClearCartAsync(userId);

                return Ok(new
                {
                    message = "Cart cleared successfully.",
                    cart
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
