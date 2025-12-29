using EcomBackend.Application.DTOs;
using EcomBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class OrderStatusEndpoints
{
    public static void MapOrderStatusEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/order-statuses").WithTags("OrderStatuses");

        group.MapGet("/", async (OrderStatusService service) =>
        {
            var statuses = await service.GetAllAsync();
            return Results.Ok(statuses);
        });

        group.MapGet("/{id:guid}", async (Guid id, OrderStatusService service) =>
        {
            var status = await service.GetByIdAsync(id);
            return status == null ? Results.NotFound() : Results.Ok(status);
        });

        group.MapPost("/", async ([FromBody] CreateOrderStatusDto dto, OrderStatusService service) =>
        {
            var status = await service.CreateAsync(dto);
            return Results.Created($"/api/order-statuses/{status.Id}", status);
        });

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateOrderStatusDto dto, OrderStatusService service) =>
        {
            var status = await service.UpdateAsync(id, dto);
            return status == null ? Results.NotFound() : Results.Ok(status);
        });

        group.MapDelete("/{id:guid}", async (Guid id, OrderStatusService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
