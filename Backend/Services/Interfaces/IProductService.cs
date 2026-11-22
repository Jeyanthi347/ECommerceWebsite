
using ECommerceAPI.DTOs.Product;

namespace ECommerceAPI.Services.Interfaces
{
    public interface IProductService
    {
        Task<ProductResponseDto?> GetProductByIdAsync(int productId);

        Task<ProductListResponseDto> GetAllProductsAsync(
            int pageNumber,
            int pageSize,
            int? categoryId = null);

        Task<ProductResponseDto> CreateProductAsync(CreateProductDto productDto);

        Task<ProductResponseDto?> UpdateProductAsync(
            int productId,
            UpdateProductDto productDto);

        Task<bool> DeleteProductAsync(int productId);
    }
}
