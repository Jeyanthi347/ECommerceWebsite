
using ECommerceAPI.DTOs.Category;

namespace ECommerceAPI.Services.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryListResponseDto> GetAllAsync(
            int pageNumber,
            int pageSize,
            bool activeOnly);

        Task<CategoryResponseDto?> GetByIdAsync(int categoryId);

        Task<bool> CategoryNameExistsAsync(
            string categoryName,
            int? excludeCategoryId = null);

        Task<CategoryResponseDto> CreateAsync(CreateCategoryDto dto);

        Task<CategoryResponseDto?> UpdateAsync(
            int categoryId,
            UpdateCategoryDto dto);

        Task<bool> DeleteAsync(int categoryId);
    }
}
