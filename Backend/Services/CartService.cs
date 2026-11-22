
using ECommerceAPI.DTOs.Cart;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using ECommerceAPI.Services.Interfaces;

namespace ECommerceAPI.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;

        public CartService(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }

        // Get customer cart
        public async Task<CartResponseDto> GetCartAsync(string userId)
        {
            var cart = await GetOrCreateCartAsync(userId);

            return MapCartToDto(cart);
        }

        // Add product to cart
        public async Task<CartResponseDto> AddToCartAsync(
            string userId,
            AddToCartDto dto)
        {
            if (dto.ProductId <= 0)
            {
                throw new ArgumentException("Invalid product ID.");
            }

            if (dto.Quantity <= 0)
            {
                throw new ArgumentException("Quantity must be greater than zero.");
            }

            var product = await _cartRepository.GetProductByIdAsync(dto.ProductId);

            if (product == null || !product.IsActive)
            {
                throw new KeyNotFoundException("Product not found or unavailable.");
            }

            var cart = await GetOrCreateCartAsync(userId);

            var existingItem = await _cartRepository.GetCartItemAsync(
                cart.CartId,
                dto.ProductId);

            int newQuantity = dto.Quantity;

            if (existingItem != null)
            {
                newQuantity += existingItem.Quantity;
            }

            if (newQuantity > product.StockQuantity)
            {
                throw new InvalidOperationException("Requested quantity exceeds available stock.");
            }

            if (existingItem != null)
            {
                existingItem.Quantity = newQuantity;

                await _cartRepository.UpdateCartItemAsync(existingItem);
            }
            else
            {
                var cartItem = new CartItem
                {
                    CartId = cart.CartId,
                    ProductId = product.ProductId,
                    Quantity = dto.Quantity,
                    AddedAt = DateTime.Now
                };

                await _cartRepository.AddCartItemAsync(cartItem);
            }

            return await GetCartAsync(userId);
        }

        // Update cart item quantity
        public async Task<CartResponseDto> UpdateCartItemAsync(
            string userId,
            int cartItemId,
            UpdateCartItemDto dto)
        {
            if (dto.Quantity <= 0)
            {
                throw new ArgumentException("Quantity must be greater than zero.");
            }

            var cart = await GetOrCreateCartAsync(userId);

            var cartItem = cart.CartItems
                .FirstOrDefault(ci => ci.CartItemId == cartItemId);

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Cart item not found.");
            }

            if (dto.Quantity > cartItem.Product.StockQuantity)
            {
                throw new InvalidOperationException("Requested quantity exceeds available stock.");
            }

            cartItem.Quantity = dto.Quantity;

            await _cartRepository.UpdateCartItemAsync(cartItem);

            return await GetCartAsync(userId);
        }

        // Remove product from cart
        public async Task<CartResponseDto> RemoveCartItemAsync(
            string userId,
            int cartItemId)
        {
            var cart = await GetOrCreateCartAsync(userId);

            var cartItem = cart.CartItems
                .FirstOrDefault(ci => ci.CartItemId == cartItemId);

            if (cartItem == null)
            {
                throw new KeyNotFoundException("Cart item not found.");
            }

            await _cartRepository.RemoveCartItemAsync(cartItem);

            return await GetCartAsync(userId);
        }

        // Clear customer cart
        public async Task<CartResponseDto> ClearCartAsync(string userId)
        {
            var cart = await GetOrCreateCartAsync(userId);

            await _cartRepository.ClearCartAsync(cart.CartId);

            return await GetCartAsync(userId);
        }

        // Get existing cart or create a new cart
        private async Task<Cart> GetOrCreateCartAsync(string userId)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CreatedAt = DateTime.Now
                };

                cart = await _cartRepository.CreateCartAsync(cart);
            }

            return cart;
        }

        // Convert cart model into response DTO
        private CartResponseDto MapCartToDto(Cart cart)
        {
            var response = new CartResponseDto
            {
                CartId = cart.CartId
            };

            foreach (var item in cart.CartItems)
            {
                var cartItemDto = new CartItemResponseDto
                {
                    CartItemId = item.CartItemId,
                    ProductId = item.ProductId,
                    ProductName = item.Product.ProductName,
                    ImageUrl = item.Product.ImageUrl,
                    Price = item.Product.Price,
                    Quantity = item.Quantity,
                    SubTotal = item.Product.Price * item.Quantity
                };

                response.Items.Add(cartItemDto);
                response.TotalItems += item.Quantity;
                response.TotalAmount += cartItemDto.SubTotal;
            }

            return response;
        }
    }
}
