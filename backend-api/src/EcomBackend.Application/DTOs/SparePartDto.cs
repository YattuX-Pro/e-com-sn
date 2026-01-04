namespace EcomBackend.Application.DTOs;

public record SparePartDto(
    Guid Id,
    string Name,
    decimal Price,
    string Description,
    string Category,
    string Image,
    List<string> Images,
    int Stock,
    bool IsActive,
    string Reference,
    string Compatibilite,
    DateTime CreatedAt
);

public record CreateSparePartDto(
    string Name,
    decimal Price,
    string Description,
    string Category,
    string Image,
    List<string>? Images,
    int Stock,
    string Reference,
    string Compatibilite
);

public record UpdateSparePartDto(
    string Name,
    decimal Price,
    string Description,
    string Category,
    string Image,
    List<string>? Images,
    int Stock,
    bool IsActive,
    string Reference,
    string Compatibilite
);
