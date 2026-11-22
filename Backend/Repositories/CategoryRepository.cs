
using ECommerceAPI.Data;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Category?> GetByIdAsync(int categoryId)
        {
            return await _context.Categories
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.CategoryId == categoryId);
        }

        public async Task<Category?> GetByNameAsync(string categoryName)
        {
            return await _context.Categories
                .FirstOrDefaultAsync(c =>
                    c.CategoryName.ToLower() == categoryName.ToLower());
        }

        public async Task<bool> CategoryNameExistsAsync(
            string categoryName,
            int? excludeCategoryId = null)
        {
            return await _context.Categories.AnyAsync(c =>
                c.CategoryName.ToLower() == categoryName.ToLower()
                && (!excludeCategoryId.HasValue
                    || c.CategoryId != excludeCategoryId.Value));
        }

        public async Task<List<Category>> GetAllAsync(
            int pageNumber,
            int pageSize,
            bool activeOnly)
        {
            var query = _context.Categories
                .Include(c => c.Products)
                .AsQueryable();

            if (activeOnly)
            {
                query = query.Where(c => c.IsActive);
            }

            return await query
                .OrderBy(c => c.CategoryName)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public async Task<int> GetTotalCountAsync(bool activeOnly)
        {
            var query = _context.Categories.AsQueryable();

            if (activeOnly)
            {
                query = query.Where(c => c.IsActive);
            }

            return await query.CountAsync();
        }

        public async Task<Category> CreateAsync(Category category)
        {
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            return category;
        }

        public async Task UpdateAsync(Category category)
        {
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
