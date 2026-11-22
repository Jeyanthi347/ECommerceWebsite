
using ECommerceAPI.DTOs.Category;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using ECommerceAPI.Services.Interfaces;

namespace ECommerceAPI.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<CategoryListResponseDto> GetAllAsync(
            int pageNumber,
            int pageSize,
            bool activeOnly)
        {
            var categories = await _categoryRepository.GetAllAsync(
                pageNumber,
                pageSize,
                activeOnly);

            int totalRecords =
                await _categoryRepository.GetTotalCountAsync(activeOnly);

            return new CategoryListResponseDto
            {
                Categories = categories.Select(c => MapToDto(c)).ToList(),
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalRecords = totalRecords,
                TotalPages = (int)Math.Ceiling(
                    totalRecords / (double)pageSize)
            };
        }

        public async Task<CategoryResponseDto?> GetByIdAsync(int categoryId)
        {
            var category =
                await _categoryRepository.GetByIdAsync(categoryId);

            if (category == null)
            {
                return null;
            }

            return MapToDto(category);
        }

        public async Task<bool> CategoryNameExistsAsync(
            string categoryName,
            int? excludeCategoryId = null)
        {
            return await _categoryRepository.CategoryNameExistsAsync(
                categoryName.Trim(),
                excludeCategoryId);
        }

        public async Task<CategoryResponseDto> CreateAsync(
            CreateCategoryDto dto)
        {
            var category = new Category
            {
                CategoryName = dto.CategoryName.Trim(),
                Description = dto.Description.Trim(),
                ImageUrl = dto.ImageUrl.Trim(),
                IsActive = true,
                CreatedAt = DateTime.Now
            };

            var createdCategory =
                await _categoryRepository.CreateAsync(category);

            return MapToDto(createdCategory);
        }

        public async Task<CategoryResponseDto?> UpdateAsync(
            int categoryId,
            UpdateCategoryDto dto)
        {
            var category =
                await _categoryRepository.GetByIdAsync(categoryId);

            if (category == null)
            {
                return null;
            }

            category.CategoryName = dto.CategoryName.Trim();
            category.Description = dto.Description.Trim();
            category.ImageUrl = dto.ImageUrl.Trim();
            category.IsActive = dto.IsActive;
            category.UpdatedAt = DateTime.Now;

            await _categoryRepository.UpdateAsync(category);

            return MapToDto(category);
        }

        public async Task<bool> DeleteAsync(int categoryId)
        {
            var category =
                await _categoryRepository.GetByIdAsync(categoryId);

            if (category == null)
            {
                return false;
            }

            // Soft delete: preserve category and its products
            category.IsActive = false;
            category.UpdatedAt = DateTime.Now;

            await _categoryRepository.UpdateAsync(category);

            return true;
        }

        private static CategoryResponseDto MapToDto(Category category)
        {
            return new CategoryResponseDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName,
                Description = category.Description,
                ImageUrl = category.ImageUrl,
                IsActive = category.IsActive,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt,
                ProductCount = category.Products.Count
            };
        }
    }
}
