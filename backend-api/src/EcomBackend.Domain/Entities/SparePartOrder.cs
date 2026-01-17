namespace EcomBackend.Domain.Entities;

public class SparePartOrder : BaseEntity
{
    public string OrderId { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerAddress { get; set; } = string.Empty;
    public Guid SparePartId { get; set; }
    public string SparePartName { get; set; } = string.Empty;
    public string SparePartReference { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "pending";
    public string? Comment { get; set; }
    public string? InternalNotes { get; set; }
}
