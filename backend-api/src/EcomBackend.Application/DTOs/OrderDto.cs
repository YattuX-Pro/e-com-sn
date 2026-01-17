namespace EcomBackend.Application.DTOs;

public record OrderDto(
    Guid Id,
    string OrderId,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    string CustomerAddress,
    Guid ProductId,
    string ProductName,
    int Quantity,
    decimal TotalPrice,
    string Status,
    string? Comment,
    string? InternalNotes,
    DateTime CreatedAt
);

public record CreateOrderDto(
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    string CustomerAddress,
    Guid ProductId,
    int Quantity,
    string? Comment = null
);

public record UpdateOrderDto(
    string Status,
    string? InternalNotes = null
);
