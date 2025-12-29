using EcomBackend.Application.DTOs;
using EcomBackend.Domain.Entities;
using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class UserRoleService
{
    private readonly ApplicationDbContext _context;

    public UserRoleService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserRoleDto>> GetAllAsync()
    {
        var roles = await _context.UserRoles
            .OrderBy(r => r.Label)
            .ToListAsync();

        return roles.Select(MapToDto);
    }

    public async Task<UserRoleDto?> GetByIdAsync(Guid id)
    {
        var role = await _context.UserRoles.FindAsync(id);
        return role == null ? null : MapToDto(role);
    }

    public async Task<UserRoleDto> CreateAsync(CreateUserRoleDto dto)
    {
        var role = new UserRole
        {
            Id = Guid.NewGuid(),
            Code = dto.Code,
            Label = dto.Label,
            Description = dto.Description,
            CreatedAt = DateTime.UtcNow
        };

        _context.UserRoles.Add(role);
        await _context.SaveChangesAsync();

        return MapToDto(role);
    }

    public async Task<UserRoleDto?> UpdateAsync(Guid id, UpdateUserRoleDto dto)
    {
        var role = await _context.UserRoles.FindAsync(id);
        if (role == null) return null;

        role.Code = dto.Code;
        role.Label = dto.Label;
        role.Description = dto.Description;

        await _context.SaveChangesAsync();

        return MapToDto(role);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var role = await _context.UserRoles.FindAsync(id);
        if (role == null) return false;

        _context.UserRoles.Remove(role);
        await _context.SaveChangesAsync();

        return true;
    }

    private static UserRoleDto MapToDto(UserRole role)
    {
        return new UserRoleDto(
            role.Id,
            role.Code,
            role.Label,
            role.Description,
            role.CreatedAt
        );
    }
}
