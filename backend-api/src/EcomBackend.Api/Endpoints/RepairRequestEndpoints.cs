using EcomBackend.Application.DTOs;
using EcomBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class RepairRequestEndpoints
{
    public static void MapRepairRequestEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/repair-requests").WithTags("RepairRequests");

        group.MapGet("/", async (RepairRequestService service) =>
        {
            var requests = await service.GetAllAsync();
            return Results.Ok(requests);
        });

        group.MapGet("/status/{status}", async (string status, RepairRequestService service) =>
        {
            var requests = await service.GetByStatusAsync(status);
            return Results.Ok(requests);
        });

        group.MapGet("/{id:guid}", async (Guid id, RepairRequestService service) =>
        {
            var request = await service.GetByIdAsync(id);
            return request == null ? Results.NotFound() : Results.Ok(request);
        });

        group.MapPost("/", async ([FromBody] CreateRepairRequestDto dto, RepairRequestService service) =>
        {
            var request = await service.CreateAsync(dto);
            return Results.Created($"/api/repair-requests/{request.Id}", request);
        });

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateRepairRequestDto dto, RepairRequestService service) =>
        {
            var request = await service.UpdateAsync(id, dto);
            return request == null ? Results.NotFound() : Results.Ok(request);
        });

        group.MapDelete("/{id:guid}", async (Guid id, RepairRequestService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
