using EcomBackend.Application.DTOs;
using EcomBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class CategoryEndpoints
{
    public static void MapCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/categories").WithTags("Categories");

        group.MapGet("/", async (CategoryService service) =>
        {
            var categories = await service.GetAllAsync();
            return Results.Ok(categories);
        });

        group.MapGet("/{id:guid}", async (Guid id, CategoryService service) =>
        {
            var category = await service.GetByIdAsync(id);
            return category == null ? Results.NotFound() : Results.Ok(category);
        });

        group.MapPost("/", async ([FromBody] CreateCategoryDto dto, CategoryService service) =>
        {
            var category = await service.CreateAsync(dto);
            return Results.Created($"/api/categories/{category.Id}", category);
        });

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateCategoryDto dto, CategoryService service) =>
        {
            var category = await service.UpdateAsync(id, dto);
            return category == null ? Results.NotFound() : Results.Ok(category);
        });

        group.MapDelete("/{id:guid}", async (Guid id, CategoryService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
