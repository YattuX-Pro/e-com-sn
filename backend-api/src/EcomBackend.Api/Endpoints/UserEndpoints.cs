using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class UserEndpoints
{
    public static void MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users").WithTags("Users");

        group.MapGet("/", async (IUserService userService) =>
        {
            var users = await userService.GetAllAsync();
            return Results.Ok(users);
        })
        .WithName("GetAllUsers")
        .WithOpenApi();

        group.MapGet("/paged", async (
            IUserService userService,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? role = null,
            [FromQuery] string? status = null,
            [FromQuery] string? sortBy = null,
            [FromQuery] bool sortDescending = false) =>
        {
            var filterParams = new UserFilterParams
            {
                Page = page,
                PageSize = pageSize,
                Search = search,
                Role = role,
                Status = status,
                SortBy = sortBy,
                SortDescending = sortDescending
            };
            var result = await userService.GetAllAsync(filterParams);
            return Results.Ok(result);
        })
        .WithName("GetPagedUsers")
        .WithOpenApi();

        group.MapGet("/{id:guid}", async (Guid id, IUserService userService) =>
        {
            var user = await userService.GetByIdAsync(id);
            return user == null ? Results.NotFound() : Results.Ok(user);
        })
        .WithName("GetUserById")
        .WithOpenApi();

        group.MapPost("/", async (CreateUserDto dto, IUserService userService) =>
        {
            try
            {
                var user = await userService.CreateAsync(dto);
                return Results.Created($"/api/users/{user.Id}", user);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("CreateUser")
        .WithOpenApi();

        group.MapPut("/{id:guid}", async (Guid id, UpdateUserDto dto, IUserService userService) =>
        {
            try
            {
                var user = await userService.UpdateAsync(id, dto);
                return Results.Ok(user);
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("UpdateUser")
        .WithOpenApi();

        group.MapDelete("/{id:guid}", async (Guid id, IUserService userService) =>
        {
            try
            {
                await userService.DeleteAsync(id);
                return Results.NoContent();
            }
            catch (Exception ex)
            {
                return Results.BadRequest(new { error = ex.Message });
            }
        })
        .WithName("DeleteUser")
        .WithOpenApi();
    }
}
