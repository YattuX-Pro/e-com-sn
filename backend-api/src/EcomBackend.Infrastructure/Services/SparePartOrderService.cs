using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using EcomBackend.Domain.Entities;
using EcomBackend.Domain.Interfaces;
using EcomBackend.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class SparePartOrderService : ISparePartOrderService
{
    private readonly IRepository<SparePartOrder> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ApplicationDbContext _context;

    public SparePartOrderService(
        IRepository<SparePartOrder> repository,
        IUnitOfWork unitOfWork,
        ApplicationDbContext context)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _context = context;
    }

    public async Task<SparePartOrderDto?> GetByIdAsync(Guid id)
    {
        var order = await _repository.GetByIdAsync(id);
        return order == null ? null : MapToDto(order);
    }

    public async Task<IEnumerable<SparePartOrderDto>> GetAllAsync()
    {
        var orders = await _repository.GetAllAsync();
        return orders.Select(MapToDto);
    }

    public async Task<PagedResult<SparePartOrderDto>> GetAllAsync(SparePartOrderFilterParams filterParams)
    {
        var query = _repository.GetQueryable();

        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.ToLower();
            query = query.Where(o => o.OrderId.ToLower().Contains(search) ||
                                   o.CustomerName.ToLower().Contains(search) ||
                                   o.CustomerPhone.ToLower().Contains(search) ||
                                   o.SparePartName.ToLower().Contains(search) ||
                                   o.SparePartReference.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(filterParams.Status))
        {
            query = query.Where(o => o.Status == filterParams.Status);
        }

        query = query.OrderByDescending(o => o.CreatedAt);

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filterParams.Page - 1) * filterParams.PageSize)
            .Take(filterParams.PageSize)
            .ToListAsync();

        return new PagedResult<SparePartOrderDto>
        {
            Items = items.Select(MapToDto),
            TotalCount = totalCount,
            Page = filterParams.Page,
            PageSize = filterParams.PageSize
        };
    }

    public async Task<SparePartOrderDto> CreateAsync(CreateSparePartOrderDto dto)
    {
        var sparePart = await _context.SpareParts.FindAsync(dto.SparePartId);
        if (sparePart == null)
            throw new Exception($"Spare part {dto.SparePartId} not found");

        var order = new SparePartOrder
        {
            Id = Guid.NewGuid(),
            OrderId = GenerateOrderId(),
            CustomerName = dto.CustomerName,
            CustomerPhone = dto.CustomerPhone,
            CustomerEmail = dto.CustomerEmail,
            CustomerAddress = dto.CustomerAddress,
            SparePartId = dto.SparePartId,
            SparePartName = sparePart.Name,
            SparePartReference = sparePart.Reference,
            Quantity = dto.Quantity,
            TotalPrice = sparePart.Price * dto.Quantity,
            Status = "pending"
        };

        await _repository.AddAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(order);
    }

    private static string GenerateOrderId()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        var randomString = new string(Enumerable.Repeat(chars, 10)
            .Select(s => s[random.Next(s.Length)]).ToArray());
        return $"SP-{randomString}";
    }

    public async Task<SparePartOrderDto> UpdateStatusAsync(Guid id, string status)
    {
        var order = await _repository.GetByIdAsync(id);
        if (order == null)
            throw new Exception("Spare part order not found");

        order.Status = status;
        await _repository.UpdateAsync(order);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _repository.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();
    }

    private static SparePartOrderDto MapToDto(SparePartOrder order)
    {
        return new SparePartOrderDto(
            order.Id,
            order.OrderId,
            order.CustomerName,
            order.CustomerPhone,
            order.CustomerEmail,
            order.CustomerAddress,
            order.SparePartId,
            order.SparePartName,
            order.SparePartReference,
            order.Quantity,
            order.TotalPrice,
            order.Status,
            order.CreatedAt
        );
    }
}
