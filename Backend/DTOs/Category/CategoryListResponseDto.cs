
namespace ECommerceAPI.DTOs.Category
{
    public class CategoryListResponseDto
    {
        public List<CategoryResponseDto> Categories { get; set; }
            = new List<CategoryResponseDto>();

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int TotalRecords { get; set; }

        public int TotalPages { get; set; }
    }
}
