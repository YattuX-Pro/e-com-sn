using EcomBackend.Infrastructure.Services;

namespace EcomBackend.Api.Endpoints;

public static class DashboardEndpoints
{
    public static void MapDashboardEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/dashboard").WithTags("Dashboard");

        group.MapGet("/stats", async (DashboardService service) =>
        {
            var stats = await service.GetStatsAsync();
            return Results.Ok(stats);
        })
        .WithName("GetDashboardStats")
        .WithOpenApi();

        group.MapGet("/recent-orders", async (DashboardService service, int? count) =>
        {
            var orders = await service.GetRecentOrdersAsync(count ?? 5);
            return Results.Ok(orders);
        })
        .WithName("GetRecentOrders")
        .WithOpenApi();

        group.MapGet("/recent-spare-part-orders", async (DashboardService service, int? count) =>
        {
            var orders = await service.GetRecentSparePartOrdersAsync(count ?? 5);
            return Results.Ok(orders);
        })
        .WithName("GetRecentSparePartOrders")
        .WithOpenApi();

        group.MapGet("/recent-repair-requests", async (DashboardService service, int? count) =>
        {
            var requests = await service.GetRecentRepairRequestsAsync(count ?? 5);
            return Results.Ok(requests);
        })
        .WithName("GetRecentRepairRequests")
        .WithOpenApi();

        group.MapGet("/popular-products", async (DashboardService service, int? count) =>
        {
            var products = await service.GetPopularProductsAsync(count ?? 5);
            return Results.Ok(products);
        })
        .WithName("GetPopularProducts")
        .WithOpenApi();
    }
}
