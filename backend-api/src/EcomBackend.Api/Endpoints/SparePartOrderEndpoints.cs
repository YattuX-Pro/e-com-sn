using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class SparePartOrderEndpoints
{
    public static void MapSparePartOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/spare-part-orders").WithTags("SparePartOrders");

        group.MapGet("/", async (ISparePartOrderService service) =>
        {
            var orders = await service.GetAllAsync();
            return Results.Ok(orders);
        })
        .WithName("GetAllSparePartOrders")
        .WithOpenApi();

        group.MapGet("/paged", async (
            ISparePartOrderService service,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? status = null) =>
        {
            var filterParams = new SparePartOrderFilterParams(page, pageSize, search, status);
            var result = await service.GetAllAsync(filterParams);
            return Results.Ok(result);
        })
        .WithName("GetPagedSparePartOrders")
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, ISparePartOrderService service) =>
        {
            var order = await service.GetByIdAsync(id);
            return order == null ? Results.NotFound() : Results.Ok(order);
        })
        .WithName("GetSparePartOrderById")
        .WithOpenApi();

        group.MapPost("/", async (CreateSparePartOrderDto dto, ISparePartOrderService service) =>
        {
            try
            {
                var order = await service.CreateAsync(dto);
                return Results.Created($"/api/spare-part-orders/{order.Id}", order);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("CreateSparePartOrder")
        .WithOpenApi();

        group.MapPatch("/{id:guid}/status", async (Guid id, [FromBody] UpdateOrderDto dto, ISparePartOrderService service) =>
        {
            try
            {
                var order = await service.UpdateStatusAsync(id, dto.Status);
                return Results.Ok(order);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("UpdateSparePartOrderStatus")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, ISparePartOrderService service) =>
        {
            try
            {
                await service.DeleteAsync(id);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("DeleteSparePartOrder")
        .WithOpenApi();
    }
}
