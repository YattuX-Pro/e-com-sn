using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using EcomBackend.Domain.Entities;
using EcomBackend.Domain.Interfaces;
using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly IRepository<Order> _orderRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;

    public OrderService(
        IRepository<Order> orderRepository, 
        IUnitOfWork unitOfWork,
        ApplicationDbContext context)
    {
        _orderRepository = orderRepository;
        _unitOfWork = unitOfWork;
        _context = context;
    }

    public async Task<OrderDto?> GetByIdAsync(Guid id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order == null ? null : MapToDto(order);
    }

    public async Task<IEnumerable<OrderDto>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return orders.Select(MapToDto);
    }

    public async Task<PagedResult<OrderDto>> GetAllAsync(OrderFilterParams filterParams)
    {
        var query = _orderRepository.GetQueryable();

        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.ToLower();
            query = query.Where(o => o.OrderId.ToLower().Contains(search) ||
                                   o.CustomerName.ToLower().Contains(search) || 
                                   o.CustomerPhone.ToLower().Contains(search) ||
                                   o.CustomerEmail.ToLower().Contains(search) ||
                                   o.ProductName.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(filterParams.OrderId))
        {
            var orderId = filterParams.OrderId.ToLower();
            query = query.Where(o => o.OrderId.ToLower().Contains(orderId));
        }

        if (!string.IsNullOrWhiteSpace(filterParams.Status))
        {
            query = query.Where(o => o.Status == filterParams.Status);
        }

        if (filterParams.FromDate.HasValue)
        {
            query = query.Where(o => o.CreatedAt >= filterParams.FromDate.Value);
        }

        if (filterParams.ToDate.HasValue)
        {
            query = query.Where(o => o.CreatedAt <= filterParams.ToDate.Value);
        }

        if (!string.IsNullOrWhiteSpace(filterParams.SortBy))
        {
            query = filterParams.SortBy.ToLower() switch
            {
                "customername" => filterParams.SortDescending ? query.OrderByDescending(o => o.CustomerName) : query.OrderBy(o => o.CustomerName),
                "totalprice" => filterParams.SortDescending ? query.OrderByDescending(o => o.TotalPrice) : query.OrderBy(o => o.TotalPrice),
                "status" => filterParams.SortDescending ? query.OrderByDescending(o => o.Status) : query.OrderBy(o => o.Status),
                "createdat" => filterParams.SortDescending ? query.OrderByDescending(o => o.CreatedAt) : query.OrderBy(o => o.CreatedAt),
                _ => query.OrderByDescending(o => o.CreatedAt)
            };
        }
        else
        {
            query = query.OrderByDescending(o => o.CreatedAt);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filterParams.Page - 1) * filterParams.PageSize)
            .Take(filterParams.PageSize)
            .ToListAsync();

        return new PagedResult<OrderDto>
        {
            Items = items.Select(MapToDto),
            TotalCount = totalCount,
            Page = filterParams.Page,
            PageSize = filterParams.PageSize
        };
    }

    public async Task<OrderDto> CreateAsync(CreateOrderDto dto)
    {
        var product = await _context.Products.FindAsync(dto.ProductId);
        if (product == null)
            throw new Exception($"Product {dto.ProductId} not found");

        var order = new Order
        {
            Id = Guid.NewGuid(),
            OrderId = GenerateOrderId(),
            CustomerName = dto.CustomerName,
            CustomerPhone = dto.CustomerPhone,
            CustomerEmail = dto.CustomerEmail,
            CustomerAddress = dto.CustomerAddress,
            ProductId = dto.ProductId,
            ProductName = product.Name,
            Quantity = dto.Quantity,
            TotalPrice = product.Price * dto.Quantity,
            Status = "pending"
        };

        await _orderRepository.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(order);
    }

    private static string GenerateOrderId()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var randomString = new string(Enumerable.Repeat(chars, 10)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        return $"ID-{randomString}";
    }

    public async Task<OrderDto> UpdateStatusAsync(Guid id, string status)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        if (order == null)
            throw new Exception("Order not found");

        order.Status = status;

        await _orderRepository.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _orderRepository.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();
    }

    private static OrderDto MapToDto(Order order)
    {
        return new OrderDto(
            order.Id,
            order.OrderId,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            order.CustomerAddress,
            order.ProductId,
            order.ProductName,
            order.Quantity,
            order.TotalPrice,
            order.Status,
            order.CreatedAt
        );
    }
}
