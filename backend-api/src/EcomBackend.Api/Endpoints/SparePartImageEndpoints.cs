using Microsoft.AspNetCore.Mvc;
using EcomBackend.Domain.Interfaces;
using EcomBackend.Domain.Entities;

namespace EcomBackend.Api.Endpoints;

public static class SparePartImageEndpoints
{
    public static void MapSparePartImageEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/spareparts").RequireAuthorization();

        group.MapPost("/{id}/images", async (
            Guid id,
            [FromForm] IFormFile? mainImage,
            [FromForm] IFormFileCollection? detailImages,
            IRepository<SparePart> sparePartRepository,
            IUnitOfWork unitOfWork,
            IWebHostEnvironment env) =>
        {
            const int MAX_IMAGES = 5;
            const long MAX_FILE_SIZE = 2 * 1024 * 1024;

            var sparePart = await sparePartRepository.GetByIdAsync(id);
            if (sparePart == null)
                return Results.NotFound(new { error = "Spare part not found" });

            if (mainImage != null && mainImage.Length > MAX_FILE_SIZE)
            {
                return Results.BadRequest(new { error = $"L'image principale dépasse 2MB ({mainImage.Length / 1024.0 / 1024.0:F2}MB)" });
            }

            if (detailImages != null && detailImages.Count > 0)
            {
                var currentDetailCount = sparePart.Images?.Count ?? 0;
                var totalAfterUpload = currentDetailCount + detailImages.Count;

                if (totalAfterUpload > MAX_IMAGES)
                {
                    return Results.BadRequest(new { error = $"Maximum {MAX_IMAGES} images de détails autorisées. Actuellement: {currentDetailCount}, tentative d'ajout: {detailImages.Count}" });
                }

                foreach (var file in detailImages)
                {
                    if (file.Length > MAX_FILE_SIZE)
                    {
                        return Results.BadRequest(new { error = $"Le fichier {file.FileName} dépasse 2MB" });
                    }
                }
            }

            var uploadsPath = Path.Combine(env.WebRootPath, "spareparts");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            if (mainImage != null)
            {
                var mainImageFileName = $"{id}-main.{Path.GetExtension(mainImage.FileName).TrimStart('.')}";
                var mainImageFilePath = Path.Combine(uploadsPath, mainImageFileName);

                using (var stream = new FileStream(mainImageFilePath, FileMode.Create))
                {
                    await mainImage.CopyToAsync(stream);
                }
                sparePart.Image = $"/spareparts/{mainImageFileName}";
            }

            if (detailImages != null && detailImages.Count > 0)
            {
                var imageList = new List<string>(sparePart.Images ?? new List<string>());
                
                int maxIndex = 0;
                foreach (var existingImage in imageList)
                {
                    var fileName = Path.GetFileNameWithoutExtension(existingImage);
                    var parts = fileName.Split('-');
                    if (parts.Length >= 2 && int.TryParse(parts[^1], out int existingIndex))
                    {
                        maxIndex = Math.Max(maxIndex, existingIndex);
                    }
                }
                
                int index = maxIndex + 1;
                
                foreach (var file in detailImages)
                {
                    var detailFileName = $"{id}-{index:D2}.{Path.GetExtension(file.FileName).TrimStart('.')}";
                    var detailFilePath = Path.Combine(uploadsPath, detailFileName);
                    
                    using (var stream = new FileStream(detailFilePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    
                    imageList.Add($"/spareparts/{detailFileName}");
                    index++;
                }

                sparePart.Images = imageList;
            }

            await sparePartRepository.UpdateAsync(sparePart);
            await unitOfWork.SaveChangesAsync();

            return Results.Ok(new { message = "Images uploaded successfully", sparePart });
        }).DisableAntiforgery();

        group.MapPost("/{id}/images/delete", async (
            Guid id,
            [FromBody] SparePartDeleteImagesRequest request,
            IRepository<SparePart> sparePartRepository,
            IUnitOfWork unitOfWork,
            IWebHostEnvironment env) =>
        {
            var sparePart = await sparePartRepository.GetByIdAsync(id);
            if (sparePart == null)
                return Results.NotFound(new { error = "Spare part not found" });

            if (request.ImagePaths == null || request.ImagePaths.Count == 0)
                return Results.BadRequest(new { error = "No images specified for deletion" });

            var uploadsPath = Path.Combine(env.WebRootPath, "spareparts");

            foreach (var imagePath in request.ImagePaths)
            {
                if (sparePart.Images.Contains(imagePath))
                {
                    sparePart.Images.Remove(imagePath);
                }

                var fileName = Path.GetFileName(imagePath);
                var filePath = Path.Combine(uploadsPath, fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }

            await sparePartRepository.UpdateAsync(sparePart);
            await unitOfWork.SaveChangesAsync();

            return Results.Ok(new { message = "Images deleted successfully", sparePart });
        });
    }
}

public record SparePartDeleteImagesRequest(List<string> ImagePaths);
