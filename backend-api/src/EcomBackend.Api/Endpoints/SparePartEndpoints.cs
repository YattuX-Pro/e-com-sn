using EcomBackend.Application.DTOs;
using EcomBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class SparePartEndpoints
{
    public static void MapSparePartEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/spareparts").WithTags("SpareParts");

        group.MapGet("/", async (SparePartService service) =>
        {
            var parts = await service.GetAllAsync();
            return Results.Ok(parts);
        });

        group.MapGet("/active", async (SparePartService service) =>
        {
            var parts = await service.GetActiveAsync();
            return Results.Ok(parts);
        });

        group.MapGet("/{id:guid}", async (Guid id, SparePartService service) =>
        {
            var part = await service.GetByIdAsync(id);
            return part == null ? Results.NotFound() : Results.Ok(part);
        });

        group.MapPost("/", async ([FromBody] CreateSparePartDto dto, SparePartService service) =>
        {
            var part = await service.CreateAsync(dto);
            return Results.Created($"/api/spareparts/{part.Id}", part);
        });

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateSparePartDto dto, SparePartService service) =>
        {
            var part = await service.UpdateAsync(id, dto);
            return part == null ? Results.NotFound() : Results.Ok(part);
        });

        group.MapDelete("/{id:guid}", async (Guid id, SparePartService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });

        group.MapPost("/{id:guid}/images", async (Guid id, [FromBody] string imageUrl, SparePartService service) =>
        {
            var part = await service.AddImageAsync(id, imageUrl);
            return part == null ? Results.NotFound() : Results.Ok(part);
        });

        group.MapDelete("/{id:guid}/images", async (Guid id, [FromBody] string imageUrl, SparePartService service) =>
        {
            var part = await service.RemoveImageAsync(id, imageUrl);
            return part == null ? Results.NotFound() : Results.Ok(part);
        });
    }
}
