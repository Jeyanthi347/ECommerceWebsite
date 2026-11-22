
using ECommerceAPI.DTOs.Category;
using ECommerceAPI.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/Categories
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] bool activeOnly = true)
        {
            if (pageNumber < 1 || pageSize < 1 || pageSize > 100)
            {
                return BadRequest("Invalid pagination values.");
            }

            var result = await _categoryService.GetAllAsync(
                pageNumber,
                pageSize,
                activeOnly);

            return Ok(result);
        }

        // GET: api/Categories/1
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);

            if (category == null || !category.IsActive)
            {
                return NotFound("Category not found.");
            }

            return Ok(category);
        }

        // POST: api/Categories
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(CreateCategoryDto dto)
        {
            bool exists = await _categoryService.CategoryNameExistsAsync(
                dto.CategoryName);

            if (exists)
            {
                return Conflict("Category name already exists.");
            }

            var category = await _categoryService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = category.CategoryId },
                category);
        }

        // PUT: api/Categories/1
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(
            int id,
            UpdateCategoryDto dto)
        {
            var existingCategory =
                await _categoryService.GetByIdAsync(id);

            if (existingCategory == null)
            {
                return NotFound("Category not found.");
            }

            bool exists = await _categoryService.CategoryNameExistsAsync(
                dto.CategoryName,
                id);

            if (exists)
            {
                return Conflict("Category name already exists.");
            }

            var updatedCategory =
                await _categoryService.UpdateAsync(id, dto);

            return Ok(updatedCategory);
        }

        // DELETE: api/Categories/1
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            bool deleted = await _categoryService.DeleteAsync(id);

            if (!deleted)
            {
                return NotFound("Category not found.");
            }

            return Ok("Category deactivated successfully.");
        }
    }
}
