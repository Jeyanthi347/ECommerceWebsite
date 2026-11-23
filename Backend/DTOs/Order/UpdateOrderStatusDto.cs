
using ECommerceAPI.Enums;
using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs.Order
{
    public class UpdateOrderStatusDto
    {
        [Required]
        [EnumDataType(typeof(OrderStatus))]
        public OrderStatus OrderStatus { get; set; }
    }
}
