
using Microsoft.AspNetCore.Identity;

namespace ECommerceAPI.Models
{
    public class User : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
