
namespace ECommerceAPI.Models
{
    public class Cart
    {
        public int CartId { get; set; }

        public string UserId { get; set; } = string.Empty;

        public User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? UpdatedAt { get; set; }

        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
