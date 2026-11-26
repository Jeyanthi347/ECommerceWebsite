
using ECommerceAPI.Data;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly ApplicationDbContext _context;

        public CustomerRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Get Customers with Search and Pagination
        public async Task<List<User>> GetCustomersAsync(
            string? search,
            int skip,
            int pageSize)
        {
            var query = from user in _context.Users
                        join userRole in _context.UserRoles
                            on user.Id equals userRole.UserId
                        join role in _context.Roles
                            on userRole.RoleId equals role.Id
                        where role.Name == "Customer"
                        select user;

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(user =>
                    user.FullName.Contains(search) ||
                    (user.Email != null && user.Email.Contains(search)));
            }

            return await query
                .Distinct()
                .OrderByDescending(user => user.CreatedAt)
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();
        }

        // Get Total Customers Count
        public async Task<int> GetTotalCustomersCountAsync(string? search)
        {
            var query = from user in _context.Users
                        join userRole in _context.UserRoles
                            on user.Id equals userRole.UserId
                        join role in _context.Roles
                            on userRole.RoleId equals role.Id
                        where role.Name == "Customer"
                        select user;

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(user =>
                    user.FullName.Contains(search) ||
                    (user.Email != null && user.Email.Contains(search)));
            }

            return await query.Distinct().CountAsync();
        }

        // Get Customer By ID
        public async Task<User?> GetCustomerByIdAsync(string customerId)
        {
            return await (
                from user in _context.Users
                join userRole in _context.UserRoles
                    on user.Id equals userRole.UserId
                join role in _context.Roles
                    on userRole.RoleId equals role.Id
                where user.Id == customerId && role.Name == "Customer"
                select user
            ).FirstOrDefaultAsync();
        }

        // Update Customer
        public async Task<bool> UpdateCustomerAsync(User customer)
        {
            _context.Users.Update(customer);

            return await _context.SaveChangesAsync() > 0;
        }
    }
}
