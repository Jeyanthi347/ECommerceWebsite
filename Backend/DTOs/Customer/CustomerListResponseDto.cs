
namespace ECommerceAPI.DTOs.Customer
{
    public class CustomerListResponseDto
    {
        public List<CustomerResponseDto> Customers { get; set; }
            = new List<CustomerResponseDto>();

        public int PageNumber { get; set; }

        public int PageSize { get; set; }

        public int TotalRecords { get; set; }

        public int TotalPages { get; set; }
    }
}
