
using ECommerceAPI.Enums;

namespace ECommerceAPI.Models
{
    public class Order
    {
        public int OrderId { get; set; }

        public string OrderNumber { get; set; } = string.Empty;

        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;

        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Pincode { get; set; } = string.Empty;

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public decimal TotalAmount { get; set; }

        public OrderStatus OrderStatus { get; set; } = OrderStatus.Pending;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
