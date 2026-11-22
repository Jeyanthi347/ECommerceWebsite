
using ECommerceAPI.Models;

namespace ECommerceAPI.Repositories.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart?> GetCartByUserIdAsync(string userId);

        Task<Cart?> GetCartByIdAsync(int cartId);

        Task<Cart> CreateCartAsync(Cart cart);

        Task<Product?> GetProductByIdAsync(int productId);

        Task<CartItem?> GetCartItemAsync(int cartId, int productId);

        Task<CartItem> AddCartItemAsync(CartItem cartItem);

        Task<CartItem> UpdateCartItemAsync(CartItem cartItem);

        Task<bool> RemoveCartItemAsync(CartItem cartItem);

        Task<bool> ClearCartAsync(int cartId);
    }
}
