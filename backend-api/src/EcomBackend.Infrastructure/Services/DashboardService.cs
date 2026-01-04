using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class DashboardService
{
    private readonly ApplicationDbContext _context;

    public DashboardService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var productsCount = await _context.Products.CountAsync();
        var ordersCount = await _context.Orders.CountAsync();
        var usersCount = await _context.Users.CountAsync();
        var sparePartsCount = await _context.SpareParts.CountAsync();
        var repairRequestsCount = await _context.RepairRequests.CountAsync();
        var sparePartOrdersCount = await _context.SparePartOrders.CountAsync();

        return new DashboardStatsDto(
            productsCount,
            ordersCount,
            usersCount,
            sparePartsCount,
            repairRequestsCount,
            sparePartOrdersCount
        );
    }

    public async Task<IEnumerable<RecentOrderDto>> GetRecentOrdersAsync(int count = 5)
    {
        var orders = await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .Take(count)
            .Select(o => new RecentOrderDto(
                o.Id,
                o.OrderId,
                o.CustomerName,
                o.TotalPrice,
                o.Status,
                o.CreatedAt
            ))
            .ToListAsync();

        return orders;
    }

    public async Task<IEnumerable<RecentSparePartOrderDto>> GetRecentSparePartOrdersAsync(int count = 5)
    {
        var orders = await _context.SparePartOrders
            .OrderByDescending(o => o.CreatedAt)
            .Take(count)
            .Select(o => new RecentSparePartOrderDto(
                o.Id,
                o.OrderId,
                o.CustomerName,
                o.SparePartName,
                o.TotalPrice,
                o.Status,
                o.CreatedAt
            ))
            .ToListAsync();

        return orders;
    }

    public async Task<IEnumerable<RecentRepairRequestDto>> GetRecentRepairRequestsAsync(int count = 5)
    {
        var requests = await _context.RepairRequests
            .OrderByDescending(r => r.CreatedAt)
            .Take(count)
            .Select(r => new RecentRepairRequestDto(
                r.Id,
                r.CustomerName,
                r.VehicleModel,
                r.ProblemDescription,
                r.Status,
                r.CreatedAt
            ))
            .ToListAsync();

        return requests;
    }

    public async Task<IEnumerable<PopularProductDto>> GetPopularProductsAsync(int count = 5)
    {
        var products = await _context.Products
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .Select(p => new PopularProductDto(
                p.Id,
                p.Name,
                p.Price,
                p.Image,
                p.Stock
            ))
            .ToListAsync();

        return products;
    }
}

public record DashboardStatsDto(
    int ProductsCount,
    int OrdersCount,
    int UsersCount,
    int SparePartsCount,
    int RepairRequestsCount,
    int SparePartOrdersCount
);

public record RecentOrderDto(
    Guid Id,
    string OrderId,
    string CustomerName,
    decimal TotalAmount,
    string Status,
    DateTime CreatedAt
);

public record RecentSparePartOrderDto(
    Guid Id,
    string OrderId,
    string CustomerName,
    string SparePartName,
    decimal TotalPrice,
    string Status,
    DateTime CreatedAt
);

public record RecentRepairRequestDto(
    Guid Id,
    string CustomerName,
    string VehicleModel,
    string ProblemDescription,
    string Status,
    DateTime CreatedAt
);

public record PopularProductDto(
    Guid Id,
    string Name,
    decimal Price,
    string Image,
    int Stock
);
