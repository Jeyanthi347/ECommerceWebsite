
namespace ECommerceAPI.DTOs.Product
{
    public class ProductListResponseDto
    {
        public List<ProductResponseDto> Products { get; set; } = new List<ProductResponseDto>();

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int TotalRecords { get; set; }

        public int TotalPages { get; set; }
    }
}
