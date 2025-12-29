namespace EcomBackend.Application.DTOs;

public record UserRoleDto(
    Guid Id,
    string Code,
    string Label,
    string? Description,
    DateTime CreatedAt
);

public record CreateUserRoleDto(
    string Code,
    string Label,
    string? Description
);

public record UpdateUserRoleDto(
    string Code,
    string Label,
    string? Description
);
