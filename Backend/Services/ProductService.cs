
using ECommerceAPI.DTOs.Product;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using ECommerceAPI.Services.Interfaces;

namespace ECommerceAPI.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<ProductResponseDto?> GetProductByIdAsync(int productId)
        {
            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null)
            {
                return null;
            }

            return MapToResponseDto(product);
        }

        public async Task<ProductListResponseDto> GetAllProductsAsync(
            int pageNumber, int pageSize)
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

            var products = await _productRepository.GetProductsAsync(skip, pageSize);

            int totalRecords = await _productRepository.GetTotalProductsCountAsync();

            int totalPages = (int)Math.Ceiling(
                (double)totalRecords / pageSize);

            return new ProductListResponseDto
            {
                Products = products.Select(MapToResponseDto).ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = totalPages
            };
        }

        public async Task<ProductResponseDto> CreateProductAsync(
            CreateProductDto productDto)
        {
            var product = new Product
            {
                ProductName = productDto.ProductName,
                Description = productDto.Description,
                Price = productDto.Price,
                StockQuantity = productDto.StockQuantity,
                ImageUrl = productDto.ImageUrl,
                Brand = productDto.Brand,
                CategoryId = productDto.CategoryId,
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            var createdProduct = await _productRepository.AddProductAsync(product);

            return MapToResponseDto(createdProduct);
        }

        public async Task<ProductResponseDto?> UpdateProductAsync(
            int productId, UpdateProductDto productDto)
        {
            var product = await _productRepository.GetProductByIdAsync(productId);

            if (product == null)
            {
                return null;
            }

            product.ProductName = productDto.ProductName;
            product.Description = productDto.Description;
            product.Price = productDto.Price;
            product.StockQuantity = productDto.StockQuantity;
            product.ImageUrl = productDto.ImageUrl;
            product.Brand = productDto.Brand;
            product.CategoryId = productDto.CategoryId;
            product.IsActive = productDto.IsActive;
            product.UpdatedAt = DateTime.Now;

            var updatedProduct = await _productRepository.UpdateProductAsync(product);

            if (updatedProduct == null)
            {
                return null;
            }

            return MapToResponseDto(updatedProduct);
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            return await _productRepository.DeleteProductAsync(productId);
        }

        private static ProductResponseDto MapToResponseDto(Product product)
        {
            return new ProductResponseDto
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl,
                Brand = product.Brand,
                CategoryId = product.CategoryId,
                CategoryName = null,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt
            };
        }
    }
}
