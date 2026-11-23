
using ECommerceAPI.Data;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Create a new order
        public async Task<Order> CreateOrderAsync(Order order)
        {
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();

            return order;
        }

        // Get order by ID
        public async Task<Order?> GetOrderByIdAsync(int orderId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderId == orderId);
        }

        // Get order by ID and customer ID
        public async Task<Order?> GetOrderByIdAndUserIdAsync(
            int orderId,
            string userId)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o =>
                    o.OrderId == orderId &&
                    o.UserId == userId);
        }

        // Get customer's orders with pagination
        public async Task<List<Order>> GetOrdersByUserIdAsync(
            string userId,
            int skip,
            int take)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        // Get all orders with pagination (Admin)
        public async Task<List<Order>> GetAllOrdersAsync(
            int skip,
            int take)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .OrderByDescending(o => o.OrderDate)
                .Skip(skip)
                .Take(take)
                .ToListAsync();
        }

        // Get total orders for a customer
        public async Task<int> GetTotalOrdersByUserIdAsync(string userId)
        {
            return await _context.Orders
                .CountAsync(o => o.UserId == userId);
        }

        // Get total orders
        public async Task<int> GetTotalOrdersAsync()
        {
            return await _context.Orders.CountAsync();
        }

        // Update order
        public async Task<bool> UpdateOrderAsync(Order order)
        {
            _context.Orders.Update(order);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}
