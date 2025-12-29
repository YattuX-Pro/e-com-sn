namespace EcomBackend.Application.DTOs;

public record OrderStatusDto(
    Guid Id,
    string Code,
    string Label,
    string? Description,
    DateTime CreatedAt
);

public record CreateOrderStatusDto(
    string Code,
    string Label,
    string? Description
);

public record UpdateOrderStatusDto(
    string Code,
    string Label,
    string? Description
);
