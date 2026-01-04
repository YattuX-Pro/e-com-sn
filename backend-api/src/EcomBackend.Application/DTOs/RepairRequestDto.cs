namespace EcomBackend.Application.DTOs;

public record RepairRequestDto(
    Guid Id,
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    string CustomerAddress,
    string VehicleType,
    string VehicleModel,
    string ProblemDescription,
    string Status,
    string? Notes,
    DateTime CreatedAt
);

public record CreateRepairRequestDto(
    string CustomerName,
    string CustomerPhone,
    string CustomerEmail,
    string CustomerAddress,
    string VehicleType,
    string VehicleModel,
    string ProblemDescription
);

public record UpdateRepairRequestDto(
    string Status,
    string? Notes
);
