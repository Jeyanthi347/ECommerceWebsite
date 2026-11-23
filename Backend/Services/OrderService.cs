
using ECommerceAPI.Data;
using ECommerceAPI.DTOs.Order;
using ECommerceAPI.Enums;
using ECommerceAPI.Models;
using ECommerceAPI.Repositories.Interfaces;
using ECommerceAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ECommerceAPI.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly ApplicationDbContext _context;

        public OrderService(
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            ApplicationDbContext context)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _context = context;
        }

        // Place order using customer cart
        public async Task<OrderResponseDto> PlaceOrderAsync(
            string userId,
            CreateOrderDto dto)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);

            if (cart == null || !cart.CartItems.Any())
            {
                throw new InvalidOperationException("Your cart is empty.");
            }

            // Validate product availability and stock
            foreach (var item in cart.CartItems)
            {
                if (!item.Product.IsActive)
                {
                    throw new InvalidOperationException(
                        $"{item.Product.ProductName} is unavailable.");
                }

                if (item.Quantity > item.Product.StockQuantity)
                {
                    throw new InvalidOperationException(
                        $"Insufficient stock for {item.Product.ProductName}.");
                }
            }

            // Start database transaction
            using var transaction =
                await _context.Database.BeginTransactionAsync();

            try
            {
                var order = new Order
                {
                    OrderNumber = "ORD-" + Guid.NewGuid().ToString("N")
                        .Substring(0, 10).ToUpper(),

                    UserId = userId,
                    FullName = dto.FullName,
                    PhoneNumber = dto.PhoneNumber,
                    DeliveryAddress = dto.DeliveryAddress,
                    City = dto.City,
                    Pincode = dto.Pincode,
                    OrderDate = DateTime.Now,
                    OrderStatus = OrderStatus.Pending,
                    TotalAmount = 0,
                    OrderItems = new List<OrderItem>()
                };

                // Create order items and reduce stock
                foreach (var cartItem in cart.CartItems)
                {
                    var product = cartItem.Product;

                    var orderItem = new OrderItem
                    {
                        ProductId = product.ProductId,
                        ProductName = product.ProductName,
                        ImageUrl = product.ImageUrl,
                        UnitPrice = product.Price,
                        Quantity = cartItem.Quantity,
                        SubTotal = product.Price * cartItem.Quantity
                    };

                    order.OrderItems.Add(orderItem);

                    order.TotalAmount += orderItem.SubTotal;

                    product.StockQuantity -= cartItem.Quantity;
                    product.UpdatedAt = DateTime.Now;
                }

                // Save order
                await _orderRepository.CreateOrderAsync(order);

                // Clear cart after successful order creation
                await _cartRepository.ClearCartAsync(cart.CartId);

                // Commit transaction
                await transaction.CommitAsync();

                return MapOrderToDto(order);
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        // Get order by ID for a particular customer
        public async Task<OrderResponseDto> GetOrderByIdAsync(
            int orderId,
            string userId)
        {
            var order = await _orderRepository.GetOrderByIdAndUserIdAsync(
                orderId,
                userId);

            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }

            return MapOrderToDto(order);
        }

        // Get customer's order history
        public async Task<List<OrderListResponseDto>> GetMyOrdersAsync(
            string userId,
            int pageNumber,
            int pageSize)
        {
            ValidatePagination(pageNumber, pageSize);

            int skip = (pageNumber - 1) * pageSize;

            var orders = await _orderRepository.GetOrdersByUserIdAsync(
                userId,
                skip,
                pageSize);

            return orders.Select(MapOrderToListDto).ToList();
        }

        // Get all orders for Admin
        public async Task<List<OrderListResponseDto>> GetAllOrdersAsync(
            int pageNumber,
            int pageSize)
        {
            ValidatePagination(pageNumber, pageSize);

            int skip = (pageNumber - 1) * pageSize;

            var orders = await _orderRepository.GetAllOrdersAsync(
                skip,
                pageSize);

            return orders.Select(MapOrderToListDto).ToList();
        }

        // Update order status (Admin)
        public async Task<OrderResponseDto> UpdateOrderStatusAsync(
            int orderId,
            UpdateOrderStatusDto dto)
        {
            if (!Enum.IsDefined(typeof(OrderStatus), dto.OrderStatus))
            {
                throw new ArgumentException("Invalid order status.");
            }

            var order = await _orderRepository.GetOrderByIdAsync(orderId);

            if (order == null)
            {
                throw new KeyNotFoundException("Order not found.");
            }

            if (order.OrderStatus == OrderStatus.Cancelled ||
                order.OrderStatus == OrderStatus.Delivered)
            {
                throw new InvalidOperationException(
                    "This order can no longer be updated.");
            }

            order.OrderStatus = dto.OrderStatus;

            await _orderRepository.UpdateOrderAsync(order);

            return MapOrderToDto(order);
        }

        // Validate pagination
        private void ValidatePagination(int pageNumber, int pageSize)
        {
            if (pageNumber < 1)
            {
                throw new ArgumentException(
                    "Page number must be greater than zero.");
            }

            if (pageSize < 1 || pageSize > 100)
            {
                throw new ArgumentException(
                    "Page size must be between 1 and 100.");
            }
        }

        // Convert Order model to response DTO
        private OrderResponseDto MapOrderToDto(Order order)
        {
            return new OrderResponseDto
            {
                OrderId = order.OrderId,
                OrderNumber = order.OrderNumber,
                FullName = order.FullName,
                PhoneNumber = order.PhoneNumber,
                DeliveryAddress = order.DeliveryAddress,
                City = order.City,
                Pincode = order.Pincode,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,

                Items = order.OrderItems.Select(item =>
                    new OrderItemResponseDto
                    {
                        OrderItemId = item.OrderItemId,
                        ProductId = item.ProductId,
                        ProductName = item.ProductName,
                        ImageUrl = item.ImageUrl,
                        UnitPrice = item.UnitPrice,
                        Quantity = item.Quantity,
                        SubTotal = item.SubTotal
                    }).ToList()
            };
        }

        // Convert Order model to order list DTO
        private OrderListResponseDto MapOrderToListDto(Order order)
        {
            return new OrderListResponseDto
            {
                OrderId = order.OrderId,
                OrderNumber = order.OrderNumber,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                OrderStatus = order.OrderStatus,
                TotalItems = order.OrderItems.Sum(item => item.Quantity)
            };
        }
    }
}
