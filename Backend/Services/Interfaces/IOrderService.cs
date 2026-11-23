
using ECommerceAPI.DTOs.Order;

namespace ECommerceAPI.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderResponseDto> PlaceOrderAsync(
            string userId,
            CreateOrderDto dto);

        Task<OrderResponseDto> GetOrderByIdAsync(
            int orderId,
            string userId);

        Task<List<OrderListResponseDto>> GetMyOrdersAsync(
            string userId,
            int pageNumber,
            int pageSize);

        Task<List<OrderListResponseDto>> GetAllOrdersAsync(
            int pageNumber,
            int pageSize);

        Task<OrderResponseDto> UpdateOrderStatusAsync(
            int orderId,
            UpdateOrderStatusDto dto);
    }
}
