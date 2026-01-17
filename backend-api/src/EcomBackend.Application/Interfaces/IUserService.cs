using EcomBackend.Application.DTOs;

namespace EcomBackend.Application.Interfaces;

public interface IUserService
{
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<PagedResult<UserDto>> GetAllAsync(UserFilterParams filterParams);
    Task<UserDto> CreateAsync(CreateUserDto createUserDto);
    Task<UserDto> UpdateAsync(Guid id, UpdateUserDto updateUserDto);
    Task DeleteAsync(Guid id);
    Task ChangePasswordAsync(Guid id, string newPassword);
    Task<UserDto> ToggleStatusAsync(Guid id);
}
