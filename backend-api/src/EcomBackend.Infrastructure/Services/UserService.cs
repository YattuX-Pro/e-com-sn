using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using EcomBackend.Domain.Entities;
using EcomBackend.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly IRepository<User> _userRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IRepository<User> userRepository, IUnitOfWork unitOfWork)
    {
        _userRepository = userRepository;
        _unitOfWork = unitOfWork;
    }

    private string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user == null ? null : MapToDto(user);
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(MapToDto);
    }

    public async Task<PagedResult<UserDto>> GetAllAsync(UserFilterParams filterParams)
    {
        var query = _userRepository.GetQueryable();

        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.ToLower();
            query = query.Where(u => u.Name.ToLower().Contains(search) || 
                                   u.Email.ToLower().Contains(search) ||
                                   u.Phone.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(filterParams.Role))
        {
            query = query.Where(u => u.Role == filterParams.Role);
        }

        if (!string.IsNullOrWhiteSpace(filterParams.Status))
        {
            query = query.Where(u => u.Status == filterParams.Status);
        }

        if (!string.IsNullOrWhiteSpace(filterParams.SortBy))
        {
            query = filterParams.SortBy.ToLower() switch
            {
                "name" => filterParams.SortDescending ? query.OrderByDescending(u => u.Name) : query.OrderBy(u => u.Name),
                "email" => filterParams.SortDescending ? query.OrderByDescending(u => u.Email) : query.OrderBy(u => u.Email),
                "role" => filterParams.SortDescending ? query.OrderByDescending(u => u.Role) : query.OrderBy(u => u.Role),
                "createdat" => filterParams.SortDescending ? query.OrderByDescending(u => u.CreatedAt) : query.OrderBy(u => u.CreatedAt),
                _ => query.OrderByDescending(u => u.CreatedAt)
            };
        }
        else
        {
            query = query.OrderByDescending(u => u.CreatedAt);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filterParams.Page - 1) * filterParams.PageSize)
            .Take(filterParams.PageSize)
            .ToListAsync();

        return new PagedResult<UserDto>
        {
            Items = items.Select(MapToDto),
            TotalCount = totalCount,
            Page = filterParams.Page,
            PageSize = filterParams.PageSize
        };
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var users = await _userRepository.GetAllAsync();
        if (users.Any(u => u.Email == dto.Email))
        {
            throw new Exception("Un utilisateur avec cet email existe déjà");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Role = dto.Role,
            Status = dto.Status,
            PasswordHash = HashPassword(dto.Password)
        };

        await _userRepository.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task ChangePasswordAsync(Guid id, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            throw new Exception("Utilisateur non trouvé");

        user.PasswordHash = HashPassword(newPassword);
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<UserDto> ToggleStatusAsync(Guid id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            throw new Exception("Utilisateur non trouvé");

        user.Status = user.Status == "active" ? "inactive" : "active";
        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserDto> UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            throw new Exception("User not found");

        user.Name = dto.Name;
        user.Email = dto.Email;
        user.Phone = dto.Phone;
        user.Role = dto.Role;
        user.Status = dto.Status;

        await _userRepository.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _userRepository.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role,
            Status = user.Status,
            CreatedAt = user.CreatedAt
        };
    }
}
