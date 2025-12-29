using EcomBackend.Application.DTOs;
using EcomBackend.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class UserRoleEndpoints
{
    public static void MapUserRoleEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/user-roles").WithTags("UserRoles");

        group.MapGet("/", async (UserRoleService service) =>
        {
            var roles = await service.GetAllAsync();
            return Results.Ok(roles);
        });

        group.MapGet("/{id:guid}", async (Guid id, UserRoleService service) =>
        {
            var role = await service.GetByIdAsync(id);
            return role == null ? Results.NotFound() : Results.Ok(role);
        });

        group.MapPost("/", async ([FromBody] CreateUserRoleDto dto, UserRoleService service) =>
        {
            var role = await service.CreateAsync(dto);
            return Results.Created($"/api/user-roles/{role.Id}", role);
        });

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateUserRoleDto dto, UserRoleService service) =>
        {
            var role = await service.UpdateAsync(id, dto);
            return role == null ? Results.NotFound() : Results.Ok(role);
        });

        group.MapDelete("/{id:guid}", async (Guid id, UserRoleService service) =>
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
