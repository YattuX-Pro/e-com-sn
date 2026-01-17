using EcomBackend.Application.DTOs;

namespace EcomBackend.Application.Interfaces;

public interface ISparePartOrderService
{
    Task<SparePartOrderDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<SparePartOrderDto>> GetAllAsync();
    Task<PagedResult<SparePartOrderDto>> GetAllAsync(SparePartOrderFilterParams filterParams);
    Task<SparePartOrderDto> CreateAsync(CreateSparePartOrderDto dto);
    Task<SparePartOrderDto> UpdateStatusAsync(Guid id, string status, string? internalNotes = null);
    Task DeleteAsync(Guid id);
}
