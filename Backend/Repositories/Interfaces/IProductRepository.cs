
using ECommerceAPI.Models;

namespace ECommerceAPI.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<Product?> GetProductByIdAsync(int productId);

        Task<List<Product>> GetProductsAsync(int skip, int take);

        Task<int> GetTotalProductsCountAsync();

        Task<Product> AddProductAsync(Product product);

        Task<Product?> UpdateProductAsync(Product product);

        Task<bool> DeleteProductAsync(int productId);

        Task<bool> ProductExistsAsync(int productId);
    }
}
