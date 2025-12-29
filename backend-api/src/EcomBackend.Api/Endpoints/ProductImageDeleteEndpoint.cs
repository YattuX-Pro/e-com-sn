using Microsoft.AspNetCore.Mvc;
using EcomBackend.Domain.Interfaces;
using EcomBackend.Domain.Entities;

namespace EcomBackend.Api.Endpoints;

public static class ProductImageDeleteEndpoint
{
    public static void MapProductImageDeleteEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products").RequireAuthorization();

        group.MapPost("/{id}/images/delete", async (
            Guid id,
            [FromBody] DeleteImagesRequest request,
            IRepository<Product> productRepository,
            IUnitOfWork unitOfWork,
            IWebHostEnvironment env) =>
        {
            var product = await productRepository.GetByIdAsync(id);
            if (product == null)
                return Results.NotFound(new { error = "Product not found" });

            if (request.ImagePaths == null || request.ImagePaths.Count == 0)
                return Results.BadRequest(new { error = "No images specified for deletion" });

            var uploadsPath = Path.Combine(env.WebRootPath, "products");

            foreach (var imagePath in request.ImagePaths)
            {
                // Supprimer de la liste du produit
                if (product.Images.Contains(imagePath))
                {
                    product.Images.Remove(imagePath);
                }

                // Supprimer le fichier physique
                var fileName = Path.GetFileName(imagePath);
                var filePath = Path.Combine(uploadsPath, fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }

            await productRepository.UpdateAsync(product);
            await unitOfWork.SaveChangesAsync();

            return Results.Ok(new { message = "Images deleted successfully", product });
        });
    }
}

public record DeleteImagesRequest(List<string> ImagePaths);
