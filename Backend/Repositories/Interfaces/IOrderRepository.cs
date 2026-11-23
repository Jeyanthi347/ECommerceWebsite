
using ECommerceAPI.Models;

namespace ECommerceAPI.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);

        Task<Order?> GetOrderByIdAsync(int orderId);

        Task<Order?> GetOrderByIdAndUserIdAsync(int orderId, string userId);

        Task<List<Order>> GetOrdersByUserIdAsync(
            string userId,
            int skip,
            int take);

        Task<List<Order>> GetAllOrdersAsync(
            int skip,
            int take);

        Task<int> GetTotalOrdersByUserIdAsync(string userId);

        Task<int> GetTotalOrdersAsync();

        Task<bool> UpdateOrderAsync(Order order);
    }
}
