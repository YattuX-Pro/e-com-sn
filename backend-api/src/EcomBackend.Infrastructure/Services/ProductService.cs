using EcomBackend.Application.DTOs;
using EcomBackend.Application.Interfaces;
using EcomBackend.Domain.Entities;
using EcomBackend.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly IRepository<Product> _productRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(IRepository<Product> productRepository, IUnitOfWork unitOfWork)
    {
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<ProductDto?> GetByIdAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        var products = await _productRepository.GetQueryable()
            .Where(p => p.IsActive)
            .ToListAsync();
        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetBestSellersAsync(int count = 10)
    {
        var products = await _productRepository.GetQueryable()
            .Where(p => p.BestSeller == true && p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync();
        return products.Select(MapToDto);
    }

    public async Task<IEnumerable<ProductDto>> GetPromotedAsync(int count = 10)
    {
        var products = await _productRepository.GetQueryable()
            .Where(p => p.IsPromoted == true && p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .ToListAsync();
        return products.Select(MapToDto);
    }

    public async Task<PagedResult<ProductDto>> GetAllAsync(ProductFilterParams filterParams)
    {
        var query = _productRepository.GetQueryable();

        if (!string.IsNullOrWhiteSpace(filterParams.Search))
        {
            var search = filterParams.Search.ToLower();
            query = query.Where(p => p.Name.ToLower().Contains(search) || 
                                   p.Description.ToLower().Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(filterParams.Category))
        {
            query = query.Where(p => p.Category == filterParams.Category);
        }

        if (filterParams.BestSeller.HasValue)
        {
            query = query.Where(p => p.BestSeller == filterParams.BestSeller.Value);
        }

        if (filterParams.IsPromoted.HasValue)
        {
            query = query.Where(p => p.IsPromoted == filterParams.IsPromoted.Value);
        }

        if (filterParams.MinPrice.HasValue)
        {
            query = query.Where(p => p.Price >= filterParams.MinPrice.Value);
        }

        if (filterParams.MaxPrice.HasValue)
        {
            query = query.Where(p => p.Price <= filterParams.MaxPrice.Value);
        }

        if (filterParams.BestSeller.HasValue)
        {
            query = query.Where(p => p.BestSeller == filterParams.BestSeller.Value);
        }

        if (filterParams.InStock.HasValue && filterParams.InStock.Value)
        {
            query = query.Where(p => p.Stock > 0);
        }

        if (!string.IsNullOrWhiteSpace(filterParams.SortBy))
        {
            query = filterParams.SortBy.ToLower() switch
            {
                "name" => filterParams.SortDescending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
                "price" => filterParams.SortDescending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
                "stock" => filterParams.SortDescending ? query.OrderByDescending(p => p.Stock) : query.OrderBy(p => p.Stock),
                "createdat" => filterParams.SortDescending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
                _ => query.OrderByDescending(p => p.CreatedAt)
            };
        }
        else
        {
            query = query.OrderByDescending(p => p.CreatedAt);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((filterParams.Page - 1) * filterParams.PageSize)
            .Take(filterParams.PageSize)
            .ToListAsync();

        return new PagedResult<ProductDto>
        {
            Items = items.Select(MapToDto),
            TotalCount = totalCount,
            Page = filterParams.Page,
            PageSize = filterParams.PageSize
        };
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Price = dto.Price,
            Description = dto.Description,
            ShortDescription = dto.ShortDescription,
            Category = dto.Category,
            Image = dto.Image,
            Images = dto.Images ?? new List<string>(),
            BestSeller = dto.BestSeller,
            IsPromoted = dto.IsPromoted,
            IsActive = dto.IsActive,
            Stock = dto.Stock,
            Marque = dto.Marque,
            Modele = dto.Modele,
            Dimension = dto.Dimension,
            Genre = dto.Genre,
            Freinage = dto.Freinage,
            SystemeD = dto.SystemeD,
            DimensionCaisseChargement = dto.DimensionCaisseChargement,
            BoiteVitesse = dto.BoiteVitesse,
            SpecificationTechnique = dto.SpecificationTechnique,
            CapaciteCharge = dto.CapaciteCharge,
            TypeCarburant = dto.TypeCarburant,
            Etat = dto.Etat
        };

        await _productRepository.AddAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductDto dto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            throw new Exception("Product not found");

        product.Name = dto.Name;
        product.Price = dto.Price;
        product.Description = dto.Description;
        product.ShortDescription = dto.ShortDescription;
        product.Category = dto.Category;
        product.Image = dto.Image;
        product.Images = dto.Images ?? product.Images;
        product.BestSeller = dto.BestSeller;
        product.IsPromoted = dto.IsPromoted;
        product.IsActive = dto.IsActive;
        product.Stock = dto.Stock;
        product.Marque = dto.Marque;
        product.Modele = dto.Modele;
        product.Dimension = dto.Dimension;
        product.Genre = dto.Genre;
        product.Freinage = dto.Freinage;
        product.SystemeD = dto.SystemeD;
        product.DimensionCaisseChargement = dto.DimensionCaisseChargement;
        product.BoiteVitesse = dto.BoiteVitesse;
        product.SpecificationTechnique = dto.SpecificationTechnique;
        product.CapaciteCharge = dto.CapaciteCharge;
        product.TypeCarburant = dto.TypeCarburant;
        product.Etat = dto.Etat;

        await _productRepository.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task<ProductDto> ToggleActiveAsync(Guid id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
            throw new Exception("Product not found");

        product.IsActive = !product.IsActive;
        await _productRepository.UpdateAsync(product);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(product);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _productRepository.DeleteAsync(id);
        await _unitOfWork.SaveChangesAsync();
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto(
            product.Id,
            product.Name,
            product.Price,
            product.Description,
            product.ShortDescription,
            product.Category,
            product.Image,
            product.Images,
            product.BestSeller,
            product.IsPromoted,
            product.IsActive,
            product.Stock,
            product.Marque,
            product.Modele,
            product.Dimension,
            product.Genre,
            product.Freinage,
            product.SystemeD,
            product.DimensionCaisseChargement,
            product.BoiteVitesse,
            product.SpecificationTechnique,
            product.CapaciteCharge,
            product.TypeCarburant,
            product.Etat,
            product.CreatedAt
        );
    }
}
