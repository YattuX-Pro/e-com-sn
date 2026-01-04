namespace EcomBackend.Application.DTOs;

public record SparePartOrderDto(
    Guid Id,
    string OrderId,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    string CustomerAddress,
    Guid SparePartId,
    string SparePartName,
    string SparePartReference,
    int Quantity,
    decimal TotalPrice,
    string Status,
    DateTime CreatedAt
);

public record CreateSparePartOrderDto(
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    string CustomerAddress,
    Guid SparePartId,
    int Quantity
);

public record SparePartOrderFilterParams(
    int Page = 1,
    int PageSize = 10,
    string? Search = null,
    string? Status = null
);
