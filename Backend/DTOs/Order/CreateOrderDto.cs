
using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs.Order
{
    public class CreateOrderDto
    {
        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string PhoneNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(250)]
        public string DeliveryAddress { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string City { get; set; } = string.Empty;

        [Required]
        [RegularExpression(@"^[0-9]{6}$",
            ErrorMessage = "Pincode must contain exactly 6 digits.")]
        public string Pincode { get; set; } = string.Empty;
    }
}
