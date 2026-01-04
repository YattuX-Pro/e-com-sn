using EcomBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class SparePartCategoryEndpoints
{
    public static void MapSparePartCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/spare-part-categories").WithTags("SparePartCategories");

        group.MapGet("/", async (SparePartCategoryService service) =>
        {
            var categories = await service.GetAllAsync();
            return Results.Ok(categories);
        })
        .WithName("GetAllSparePartCategories")
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, SparePartCategoryService service) =>
        {
            var category = await service.GetByIdAsync(id);
            return category == null ? Results.NotFound() : Results.Ok(category);
        })
        .WithName("GetSparePartCategoryById")
        .WithOpenApi();

        group.MapPost("/", async (CreateSparePartCategoryDto dto, SparePartCategoryService service) =>
        {
            var category = await service.CreateAsync(dto);
            return Results.Created($"/api/spare-part-categories/{category.Id}", category);
        })
        .WithName("CreateSparePartCategory")
        .WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateSparePartCategoryDto dto, SparePartCategoryService service) =>
        {
            var category = await service.UpdateAsync(id, dto);
            return category == null ? Results.NotFound() : Results.Ok(category);
        })
        .WithName("UpdateSparePartCategory")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, SparePartCategoryService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteSparePartCategory")
        .WithOpenApi();
    }
}
