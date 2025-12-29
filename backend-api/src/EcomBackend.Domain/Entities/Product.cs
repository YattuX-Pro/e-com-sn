namespace EcomBackend.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new List<string>();
    public bool BestSeller { get; set; } = false;
    public bool IsPromoted { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public int Stock { get; set; }
    
    public string Marque { get; set; } = string.Empty;
    public string Modele { get; set; } = string.Empty;
    public string Dimension { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string Freinage { get; set; } = string.Empty;
    public string SystemeD { get; set; } = string.Empty;
    public string DimensionCaisseChargement { get; set; } = string.Empty;
    public string BoiteVitesse { get; set; } = string.Empty;
    public string SpecificationTechnique { get; set; } = string.Empty;
}
