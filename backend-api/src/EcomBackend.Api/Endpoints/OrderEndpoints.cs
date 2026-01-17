using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class OrderEndpoints
{
    public static void MapOrderEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders");

        group.MapGet("/", async (IOrderService orderService) =>
        {
            var orders = await orderService.GetAllAsync();
            return Results.Ok(orders);
        })
        .WithName("GetAllOrders")
        .WithOpenApi();

        group.MapGet("/paged", async (
            IOrderService orderService,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? orderId = null,
            [FromQuery] string? status = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool sortDescending = false) =>
        {
            var filterParams = new OrderFilterParams
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                OrderId = orderId,
                Status = status,
                FromDate = fromDate,
                ToDate = toDate,
                SortBy = sortBy,
                SortDescending = sortDescending
            };
            var result = await orderService.GetAllAsync(filterParams);
            return Results.Ok(result);
        })
        .WithName("GetPagedOrders")
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, IOrderService orderService) =>
        {
            var order = await orderService.GetByIdAsync(id);
            return order == null ? Results.NotFound() : Results.Ok(order);
        })
        .WithName("GetOrderById")
        .WithOpenApi();

        group.MapPost("/", async (CreateOrderDto dto, IOrderService orderService) =>
        {
            try
            {
                var order = await orderService.CreateAsync(dto);
                return Results.Created($"/api/orders/{order.Id}", order);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("CreateOrder")
        .WithOpenApi();

        group.MapPatch("/{id:guid}/status", async (Guid id, UpdateOrderDto dto, IOrderService orderService) =>
        {
            try
            {
                var order = await orderService.UpdateStatusAsync(id, dto.Status, dto.InternalNotes);
                return Results.Ok(order);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("UpdateOrderStatus")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, IOrderService orderService) =>
        {
            try
            {
                await orderService.DeleteAsync(id);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("DeleteOrder")
        .WithOpenApi();
    }
}
