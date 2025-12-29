using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class ProductEndpoints
{
    public static void MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products").WithTags("Products");

        group.MapGet("/", async (IProductService productService) =>
        {
            var products = await productService.GetAllAsync();
            return Results.Ok(products);
        })
        .WithName("GetAllProducts")
        .WithOpenApi();

        group.MapGet("/bestsellers", async (IProductService productService) =>
        {
            var products = await productService.GetBestSellersAsync(4);
            return Results.Ok(products);
        })
        .WithName("GetBestSellers")
        .WithOpenApi();

        group.MapGet("/promoted", async (IProductService productService) =>
        {
            var products = await productService.GetPromotedAsync(10);
            return Results.Ok(products);
        })
        .WithName("GetPromotedProducts")
        .WithOpenApi();

        group.MapGet("/paged", async (
            IProductService productService,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? category = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] bool? bestSeller = null,
            [FromQuery] bool? inStock = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool sortDescending = false) =>
        {
            var filterParams = new ProductFilterParams
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                Category = category,
                MinPrice = minPrice,
                MaxPrice = maxPrice,
                BestSeller = bestSeller,
                InStock = inStock,
                SortBy = sortBy,
                SortDescending = sortDescending
            };
            var result = await productService.GetAllAsync(filterParams);
            return Results.Ok(result);
        })
        .WithName("GetPagedProducts")
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, IProductService productService) =>
        {
            var product = await productService.GetByIdAsync(id);
            return product == null ? Results.NotFound() : Results.Ok(product);
        })
        .WithName("GetProductById")
        .WithOpenApi();

        group.MapPost("/", async (CreateProductDto dto, IProductService productService) =>
        {
            try
            {
                var product = await productService.CreateAsync(dto);
                return Results.Created($"/api/products/{product.Id}", product);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("CreateProduct")
        .WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateProductDto dto, IProductService productService) =>
        {
            try
            {
                var product = await productService.UpdateAsync(id, dto);
                return Results.Ok(product);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("UpdateProduct")
        .WithOpenApi();

        group.MapPatch("/{id:guid}/toggle-active", async (Guid id, IProductService productService) =>
        {
            try
            {
                var product = await productService.ToggleActiveAsync(id);
                return Results.Ok(product);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("ToggleProductActive")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, IProductService productService) =>
        {
            try
            {
                await productService.DeleteAsync(id);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("DeleteProduct")
        .WithOpenApi();
    }
}
