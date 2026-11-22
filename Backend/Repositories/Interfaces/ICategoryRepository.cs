
using ECommerceAPI.Models;

namespace ECommerceAPI.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<Category?> GetByIdAsync(int categoryId);

        Task<Category?> GetByNameAsync(string categoryName);

        Task<bool> CategoryNameExistsAsync(
            string categoryName,
            int? excludeCategoryId = null);

        Task<List<Category>> GetAllAsync(
            int pageNumber,
            int pageSize,
            bool activeOnly);

        Task<int> GetTotalCountAsync(bool activeOnly);

        Task<Category> CreateAsync(Category category);

        Task UpdateAsync(Category category);

        Task SaveChangesAsync();
    }
}
