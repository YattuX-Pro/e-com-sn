using EcomBackend.Application.DTOs;
using EcomBackend.Domain.Entities;
using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class SparePartCategoryService
{
    private readonly ApplicationDbContext _context;

    public SparePartCategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<SparePartCategoryDto>> GetAllAsync()
    {
        var categories = await _context.SparePartCategories
            .OrderBy(c => c.Name)
            .ToListAsync();

        return categories.Select(MapToDto);
    }

    public async Task<SparePartCategoryDto?> GetByIdAsync(Guid id)
    {
        var category = await _context.SparePartCategories.FindAsync(id);
        return category == null ? null : MapToDto(category);
    }

    public async Task<SparePartCategoryDto> CreateAsync(CreateSparePartCategoryDto dto)
    {
        var category = new SparePartCategory
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Description = dto.Description ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        _context.SparePartCategories.Add(category);
        await _context.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<SparePartCategoryDto?> UpdateAsync(Guid id, UpdateSparePartCategoryDto dto)
    {
        var category = await _context.SparePartCategories.FindAsync(id);
        if (category == null) return null;

        category.Name = dto.Name;
        category.Description = dto.Description ?? string.Empty;

        await _context.SaveChangesAsync();

        return MapToDto(category);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var category = await _context.SparePartCategories.FindAsync(id);
        if (category == null) return false;

        _context.SparePartCategories.Remove(category);
        await _context.SaveChangesAsync();

        return true;
    }

    private static SparePartCategoryDto MapToDto(SparePartCategory category)
    {
        return new SparePartCategoryDto(
            category.Id,
            category.Name,
            category.Description,
            category.CreatedAt
        );
    }
}

public record SparePartCategoryDto(Guid Id, string Name, string Description, DateTime CreatedAt);
public record CreateSparePartCategoryDto(string Name, string? Description);
public record UpdateSparePartCategoryDto(string Name, string? Description);
