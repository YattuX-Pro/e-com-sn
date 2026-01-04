using EcomBackend.Application.DTOs;
using EcomBackend.Domain.Entities;
using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class RepairRequestService
{
    private readonly ApplicationDbContext _context;

    public RepairRequestService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<RepairRequestDto>> GetAllAsync()
    {
        var requests = await _context.RepairRequests.OrderByDescending(r => r.CreatedAt).ToListAsync();
        return requests.Select(MapToDto);
    }

    public async Task<IEnumerable<RepairRequestDto>> GetByStatusAsync(string status)
    {
        var requests = await _context.RepairRequests.Where(r => r.Status == status).OrderByDescending(r => r.CreatedAt).ToListAsync();
        return requests.Select(MapToDto);
    }

    public async Task<RepairRequestDto?> GetByIdAsync(Guid id)
    {
        var request = await _context.RepairRequests.FindAsync(id);
        return request == null ? null : MapToDto(request);
    }

    public async Task<RepairRequestDto> CreateAsync(CreateRepairRequestDto dto)
    {
        var request = new RepairRequest
        {
            Id = Guid.NewGuid(),
            CustomerName = dto.CustomerName,
            CustomerPhone = dto.CustomerPhone,
            CustomerEmail = dto.CustomerEmail,
            CustomerAddress = dto.CustomerAddress,
            VehicleType = dto.VehicleType,
            VehicleModel = dto.VehicleModel,
            ProblemDescription = dto.ProblemDescription,
            Status = "pending",
            CreatedAt = DateTime.UtcNow
        };
        _context.RepairRequests.Add(request);
        await _context.SaveChangesAsync();
        return MapToDto(request);
    }

    public async Task<RepairRequestDto?> UpdateAsync(Guid id, UpdateRepairRequestDto dto)
    {
        var request = await _context.RepairRequests.FindAsync(id);
        if (request == null) return null;
        request.Status = dto.Status;
        request.Notes = dto.Notes;
        request.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return MapToDto(request);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var request = await _context.RepairRequests.FindAsync(id);
        if (request == null) return false;
        _context.RepairRequests.Remove(request);
        await _context.SaveChangesAsync();
        return true;
    }

    private static RepairRequestDto MapToDto(RepairRequest request)
    {
        return new RepairRequestDto(
            request.Id,
            request.CustomerName,
            request.CustomerPhone,
            request.CustomerEmail,
            request.CustomerAddress,
            request.VehicleType,
            request.VehicleModel,
            request.ProblemDescription,
            request.Status,
            request.Notes,
            request.CreatedAt
        );
    }
}
