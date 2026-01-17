using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace EcomBackend.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/login", async ([FromBody] LoginDto loginDto, IAuthService authService) =>
        {
            try
            {
                var result = await authService.LoginAsync(loginDto);
                return result != null ? Results.Ok(result) : Results.Unauthorized();
            }
            catch (UnauthorizedAccessException ex)
            {
                return Results.Json(new { error = ex.Message }, statusCode: 403);
            }
        })
        .WithName("Login")
        .WithOpenApi();

        group.MapPost("/register", async ([FromBody] RegisterDto registerDto, IAuthService authService) =>
        {
            var result = await authService.RegisterAsync(registerDto);
            return result != null ? Results.Ok(result) : Results.BadRequest(new { message = "Email already exists" });
        })
        .WithName("Register")
        .WithOpenApi();
    }
}
