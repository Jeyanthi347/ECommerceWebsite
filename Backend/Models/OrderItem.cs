
namespace ECommerceAPI.Models
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }

        public int OrderId { get; set; }
        public Order Order { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        // Product details are saved as snapshots for order history.
        public string ProductName { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }

        public decimal UnitPrice { get; set; }

        public int Quantity { get; set; }

        public decimal SubTotal { get; set; }
    }
}
