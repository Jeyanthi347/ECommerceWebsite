
using ECommerceAPI.Enums;

namespace ECommerceAPI.DTOs.Order
{
    public class OrderListResponseDto
    {
        public int OrderId { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; }

        public decimal TotalAmount { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public int TotalItems { get; set; }
    }
}
