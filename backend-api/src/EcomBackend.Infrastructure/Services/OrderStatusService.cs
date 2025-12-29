using EcomBackend.Application.DTOs;
using EcomBackend.Domain.Entities;
using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class OrderStatusService
{
    private readonly ApplicationDbContext _context;

    public OrderStatusService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<OrderStatusDto>> GetAllAsync()
    {
        var statuses = await _context.OrderStatuses
            .OrderBy(s => s.Label)
            .ToListAsync();

        return statuses.Select(MapToDto);
    }

    public async Task<OrderStatusDto?> GetByIdAsync(Guid id)
    {
        var status = await _context.OrderStatuses.FindAsync(id);
        return status == null ? null : MapToDto(status);
    }

    public async Task<OrderStatusDto> CreateAsync(CreateOrderStatusDto dto)
    {
        var status = new OrderStatus
        {
            Id = Guid.NewGuid(),
            Code = dto.Code,
            Label = dto.Label,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.OrderStatuses.Add(status);
        await _context.SaveChangesAsync();

        return MapToDto(status);
    }

    public async Task<OrderStatusDto?> UpdateAsync(Guid id, UpdateOrderStatusDto dto)
    {
        var status = await _context.OrderStatuses.FindAsync(id);
        if (status == null) return null;

        status.Code = dto.Code;
        status.Label = dto.Label;
        status.Description = dto.Description;

        await _context.SaveChangesAsync();

        return MapToDto(status);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var status = await _context.OrderStatuses.FindAsync(id);
        if (status == null) return false;

        _context.OrderStatuses.Remove(status);
        await _context.SaveChangesAsync();

        return true;
    }

    private static OrderStatusDto MapToDto(OrderStatus status)
    {
        return new OrderStatusDto(
            status.Id,
            status.Code,
            status.Label,
            status.Description,
            status.CreatedAt
        );
    }
}
