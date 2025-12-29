using EcomBackend.Application.DTOs;

namespace EcomBackend.Application.Interfaces;

public interface IProductService
{
    Task<ProductDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<ProductDto>> GetAllAsync();
    Task<PagedResult<ProductDto>> GetAllAsync(ProductFilterParams filterParams);
    Task<IEnumerable<ProductDto>> GetBestSellersAsync(int count = 10);
    Task<IEnumerable<ProductDto>> GetPromotedAsync(int count = 10);
    Task<ProductDto> CreateAsync(CreateProductDto createProductDto);
    Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto updateProductDto);
    Task<ProductDto> ToggleActiveAsync(Guid id);
    Task DeleteAsync(Guid id);
}
