using EcomBackend.Application.DTOs;

namespace EcomBackend.Application.Interfaces;

public interface IOrderService
{
    Task<OrderDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<OrderDto>> GetAllAsync();
    Task<PagedResult<OrderDto>> GetAllAsync(OrderFilterParams filterParams);
    Task<OrderDto> CreateAsync(CreateOrderDto createOrderDto);
    Task<OrderDto> UpdateStatusAsync(Guid id, string status, string? internalNotes = null);
    Task DeleteAsync(Guid id);
}
