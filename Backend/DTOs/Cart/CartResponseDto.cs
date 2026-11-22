
namespace ECommerceAPI.DTOs.Cart
{
    public class CartResponseDto
    {
        public int CartId { get; set; }

        public List<CartItemResponseDto> Items { get; set; } = new List<CartItemResponseDto>();

        public int TotalItems { get; set; }

        public decimal TotalAmount { get; set; }
    }
}
