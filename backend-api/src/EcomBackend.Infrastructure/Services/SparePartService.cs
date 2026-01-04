using EcomBackend.Application.DTOs;
using EcomBackend.Domain.Entities;
using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class SparePartService
{
    private readonly ApplicationDbContext _context;

    public SparePartService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SparePartDto>> GetAllAsync()
    {
        var parts = await _context.SpareParts.OrderByDescending(p => p.CreatedAt).ToListAsync();
        return parts.Select(MapToDto);
    }

    public async Task<IEnumerable<SparePartDto>> GetActiveAsync()
    {
        var parts = await _context.SpareParts.Where(p => p.IsActive).OrderByDescending(p => p.CreatedAt).ToListAsync();
        return parts.Select(MapToDto);
    }

    public async Task<SparePartDto?> GetByIdAsync(Guid id)
    {
        var part = await _context.SpareParts.FindAsync(id);
        return part == null ? null : MapToDto(part);
    }

    public async Task<SparePartDto> CreateAsync(CreateSparePartDto dto)
    {
        var part = new SparePart
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            Category = dto.Category,
            Image = dto.Image,
            Images = dto.Images ?? new List<string>(),
            Stock = dto.Stock,
            Reference = dto.Reference,
            Compatibilite = dto.Compatibilite,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };
        _context.SpareParts.Add(part);
        await _context.SaveChangesAsync();
        return MapToDto(part);
    }

    public async Task<SparePartDto?> UpdateAsync(Guid id, UpdateSparePartDto dto)
    {
        var part = await _context.SpareParts.FindAsync(id);
        if (part == null) return null;
        part.Name = dto.Name;
        part.Price = dto.Price;
        part.Description = dto.Description;
        part.Category = dto.Category;
        part.Image = dto.Image;
        part.Images = dto.Images ?? part.Images;
        part.Stock = dto.Stock;
        part.IsActive = dto.IsActive;
        part.Reference = dto.Reference;
        part.Compatibilite = dto.Compatibilite;
        part.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return MapToDto(part);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var part = await _context.SpareParts.FindAsync(id);
        if (part == null) return false;
        _context.SpareParts.Remove(part);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<SparePartDto?> AddImageAsync(Guid id, string imageUrl)
    {
        var part = await _context.SpareParts.FindAsync(id);
        if (part == null) return null;
        part.Images.Add(imageUrl);
        part.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return MapToDto(part);
    }

    public async Task<SparePartDto?> RemoveImageAsync(Guid id, string imageUrl)
    {
        var part = await _context.SpareParts.FindAsync(id);
        if (part == null) return null;
        part.Images.Remove(imageUrl);
        part.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return MapToDto(part);
    }

    private static SparePartDto MapToDto(SparePart part)
    {
        return new SparePartDto(
            part.Id,
            part.Name,
            part.Price,
            part.Description,
            part.Category,
            part.Image,
            part.Images,
            part.Stock,
            part.IsActive,
            part.Reference,
            part.Compatibilite,
            part.CreatedAt
        );
    }
}
