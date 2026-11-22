
using ECommerceAPI.DTOs.Product;
using ECommerceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        // GET: api/Products?pageNumber=1&pageSize=10&categoryId=1
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllProducts(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? categoryId = null)
        {
            var products = await _productService.GetAllProductsAsync(
                pageNumber,
                pageSize,
                categoryId);

            return Ok(products);
        }

        // GET: api/Products/1
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Product not found."
                });
            }

            return Ok(product);
        }

        // POST: api/Products
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct(
            [FromBody] CreateProductDto productDto)
        {
            var product = await _productService.CreateProductAsync(productDto);

            return CreatedAtAction(
                nameof(GetProductById),
                new { id = product.ProductId },
                product);
        }

        // PUT: api/Products/1
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(
            int id,
            [FromBody] UpdateProductDto productDto)
        {
            var product = await _productService.UpdateProductAsync(id, productDto);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Product not found."
                });
            }

            return Ok(product);
        }

        // DELETE: api/Products/1
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var result = await _productService.DeleteProductAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Product not found."
                });
            }

            return Ok(new
            {
                message = "Product deleted successfully."
            });
        }
    }
}
