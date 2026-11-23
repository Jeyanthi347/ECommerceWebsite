
using ECommerceAPI.Enums;

namespace ECommerceAPI.DTOs.Order
{
    public class OrderResponseDto
    {
        public int OrderId { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

        public string DeliveryAddress { get; set; } = string.Empty;

        public string City { get; set; } = string.Empty;

        public string Pincode { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public List<OrderItemResponseDto> Items { get; set; } = new();
    }
}
