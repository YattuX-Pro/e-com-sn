using EcomBackend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EcomBackend.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (!await context.Users.AnyAsync())
        {
            var adminUser = new User
            {
                Id = Guid.NewGuid(),
                Name = "Administrateur",
                Email = "admin@hasilaza.com",
                Phone = "+221 765788887",
                Role = "admin",
                Status = "active",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                CreatedAt = DateTime.UtcNow
            };

            await context.Users.AddAsync(adminUser);
            await context.SaveChangesAsync();
        }

        if (!await context.Products.AnyAsync())
        {
            var products = new List<Product>
            {
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Tricycle Cargo 200cc",
                    Price = 2500000,
                    Description = "Tricycle cargo robuste avec moteur 200cc, capacité de charge 500kg, idéal pour le transport de marchandises. Équipé d'un système de freinage hydraulique, suspension renforcée et benne basculante.",
                    ShortDescription = "Tricycle cargo robuste 500kg",
                    Category = "Cargo",
                    Image = "/products/01.jpeg",
                    Images = new List<string> { "/products/01.jpeg", "/products/01-01.jpeg", "/products/01-02.jpeg" },
                    BestSeller = true,
                    Stock = 15,
                    Marque = "Haojue",
                    Modele = "HJ200ZH-C",
                    Dimension = "3.8m x 1.3m x 1.7m",
                    Genre = "Cargo",
                    Freinage = "Freinage hydraulique avant et arrière",
                    SystemeD = "Démarrage électrique + kick",
                    DimensionCaisseChargement = "2.0m x 1.2m x 0.4m",
                    BoiteVitesse = "5 vitesses manuelles",
                    SpecificationTechnique = "Moteur monocylindre 4 temps refroidi par air, 200cc, 12.5 CV",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Tricycle Passager 150cc",
                    Price = 1800000,
                    Description = "Tricycle confortable pour transport de passagers, moteur 150cc économique, 6 places assises, toit rigide, vitres coulissantes. Parfait pour taxi urbain.",
                    ShortDescription = "Tricycle passager 6 places",
                    Category = "Passager",
                    Image = "/products/02.jpeg",
                    Images = new List<string> { "/products/02.jpeg", "/products/02-01.jpeg", "/products/02-02.jpeg" },
                    BestSeller = true,
                    Stock = 20,
                    Marque = "Lifan",
                    Modele = "LF150ZK-A",
                    Dimension = "3.2m x 1.4m x 1.8m",
                    Genre = "Passager",
                    Freinage = "Freinage à disque avant, tambour arrière",
                    SystemeD = "Démarrage électrique",
                    DimensionCaisseChargement = "N/A",
                    BoiteVitesse = "4 vitesses + marche arrière",
                    SpecificationTechnique = "Moteur monocylindre 4 temps, 150cc, 10 CV, cabine fermée",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Tricycle Mixte 175cc",
                    Price = 2200000,
                    Description = "Tricycle polyvalent cargo et passagers, moteur 175cc puissant, configuration modulable, benne amovible. Idéal pour usage commercial mixte.",
                    ShortDescription = "Tricycle mixte polyvalent",
                    Category = "Mixte",
                    Image = "/products/03.jpeg",
                    Images = new List<string> { "/products/03.jpeg", "/products/03-01.jpeg" },
                    BestSeller = false,
                    Stock = 12,
                    Marque = "Zongshen",
                    Modele = "ZS175ZH-M",
                    Dimension = "3.5m x 1.35m x 1.75m",
                    Genre = "Mixte",
                    Freinage = "Freinage hydraulique double disque",
                    SystemeD = "Démarrage électrique + kick",
                    DimensionCaisseChargement = "1.8m x 1.1m (modulable)",
                    BoiteVitesse = "5 vitesses + marche arrière",
                    SpecificationTechnique = "Moteur 4 temps refroidi par eau, 175cc, 11.5 CV, benne basculante",
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Tricycle Électrique Cargo",
                    Price = 3500000,
                    Description = "Tricycle électrique écologique, batterie lithium 72V 100Ah, autonomie 120km, charge rapide 4h, moteur silencieux 3000W, capacité 400kg.",
                    ShortDescription = "Tricycle électrique écologique",
                    Category = "Électrique",
                    Image = "/products/01.jpeg",
                    Images = new List<string> { "/products/01.jpeg", "/products/01-01.jpeg", "/products/01-02.jpeg" },
                    BestSeller = true,
                    Stock = 8,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Tricycle Cargo Heavy Duty 250cc",
                    Price = 3200000,
                    Description = "Tricycle cargo renforcé pour charges lourdes, moteur 250cc, capacité 800kg, châssis acier renforcé, double suspension, benne hydraulique.",
                    ShortDescription = "Tricycle heavy duty 800kg",
                    Category = "Cargo",
                    Image = "/products/02.jpeg",
                    Images = new List<string> { "/products/02.jpeg", "/products/02-01.jpeg", "/products/02-02.jpeg" },
                    BestSeller = false,
                    Stock = 10,
                    CreatedAt = DateTime.UtcNow
                },
                new Product
                {
                    Id = Guid.NewGuid(),
                    Name = "Tricycle Passager Luxe 200cc",
                    Price = 2800000,
                    Description = "Tricycle passager haut de gamme, moteur 200cc, climatisation, sièges en cuir, système audio, 8 places confortables. Design moderne et élégant.",
                    ShortDescription = "Tricycle passager luxe climatisé",
                    Category = "Passager",
                    Image = "/products/03.jpeg",
                    Images = new List<string> { "/products/03.jpeg", "/products/03-01.jpeg" },
                    BestSeller = true,
                    Stock = 6,
                    CreatedAt = DateTime.UtcNow
                }
            };

            await context.Products.AddRangeAsync(products);
            await context.SaveChangesAsync();
        }
    }
}
