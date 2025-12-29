using Microsoft.AspNetCore.Mvc;
using EcomBackend.Domain.Interfaces;
using EcomBackend.Domain.Entities;

namespace EcomBackend.Api.Endpoints;

public static class ProductImageEndpoints
{
    public static void MapProductImageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products").RequireAuthorization();

        group.MapPost("/{id}/images", async (
            Guid id,
            [FromForm] IFormFile? mainImage,
            [FromForm] IFormFileCollection? detailImages,
            IRepository<Product> productRepository,
            IUnitOfWork unitOfWork,
            IWebHostEnvironment env) =>
        {
            const int MAX_IMAGES = 5;
            const long MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

            var product = await productRepository.GetByIdAsync(id);
            if (product == null)
                return Results.NotFound(new { error = "Product not found" });

            if (mainImage != null && mainImage.Length > MAX_FILE_SIZE)
            {
                return Results.BadRequest(new { error = $"L'image principale dépasse 2MB ({mainImage.Length / 1024.0 / 1024.0:F2}MB)" });
            }

            if (detailImages != null && detailImages.Count > 0)
            {
                var currentDetailCount = (product.Images?.Count ?? 0) - (string.IsNullOrEmpty(product.Image) ? 0 : 1);
                var totalAfterUpload = currentDetailCount + detailImages.Count;

                if (totalAfterUpload > MAX_IMAGES)
                {
                    return Results.BadRequest(new { error = $"Maximum {MAX_IMAGES} images de détails autorisées. Actuellement: {currentDetailCount}, tentative d'ajout: {detailImages.Count}" });
                }

                foreach (var file in detailImages)
                {
                    if (file.Length > MAX_FILE_SIZE)
                    {
                        return Results.BadRequest(new { error = $"Le fichier {file.FileName} dépasse 2MB ({file.Length / 1024.0 / 1024.0:F2}MB)" });
                    }
                }
            }

            var uploadsPath = Path.Combine(env.WebRootPath, "products");
            Directory.CreateDirectory(uploadsPath);

            if (mainImage != null)
            {
                var mainImageFileName = $"{id}.{Path.GetExtension(mainImage.FileName).TrimStart('.')}";
                var mainImagePath = Path.Combine(uploadsPath, mainImageFileName);
                
                using (var stream = new FileStream(mainImagePath, FileMode.Create))
                {
                    await mainImage.CopyToAsync(stream);
                }
                
                product.Image = $"/products/{mainImageFileName}";
            }

            if (detailImages != null && detailImages.Count > 0)
            {
                var imageList = new List<string>(product.Images ?? new List<string>());
                
                int maxIndex = 0;
                foreach (var existingImage in imageList)
                {
                    var fileName = Path.GetFileNameWithoutExtension(existingImage);
                    if (fileName.StartsWith($"{id}-"))
                    {
                        var parts = fileName.Split('-');
                        if (parts.Length > 1 && int.TryParse(parts[1], out int idx))
                        {
                            maxIndex = Math.Max(maxIndex, idx);
                        }
                    }
                }
                
                int index = maxIndex + 1;
                
                foreach (var file in detailImages)
                {
                    var detailFileName = $"{id}-{index:D2}.{Path.GetExtension(file.FileName).TrimStart('.')}";                    var detailFilePath = Path.Combine(uploadsPath, detailFileName);
                    
                    using (var stream = new FileStream(detailFilePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    
                    imageList.Add($"/products/{detailFileName}");
                    index++;
                }

                product.Images = imageList;
            }

            await productRepository.UpdateAsync(product);
            await unitOfWork.SaveChangesAsync();

            return Results.Ok(new { message = "Images uploaded successfully", product });
        }).DisableAntiforgery();
    }
}
