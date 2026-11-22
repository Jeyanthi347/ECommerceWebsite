
using System.ComponentModel.DataAnnotations;

namespace ECommerceAPI.DTOs.Category
{
    public class UpdateCategoryDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string CategoryName { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [StringLength(1000)]
        public string ImageUrl { get; set; } = string.Empty;

        public bool IsActive { get; set; }
    }
}
