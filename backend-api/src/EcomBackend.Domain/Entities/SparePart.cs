namespace EcomBackend.Domain.Entities;

public class SparePart : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public List<string> Images { get; set; } = new List<string>();
    public int Stock { get; set; }
    public bool IsActive { get; set; } = true;
    public string Reference { get; set; } = string.Empty;
    public string Compatibilite { get; set; } = string.Empty;
}
