namespace EcomBackend.Domain.Entities;

public class RepairRequest : BaseEntity
{
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerAddress { get; set; } = string.Empty;
    public string VehicleType { get; set; } = string.Empty;
    public string VehicleModel { get; set; } = string.Empty;
    public string ProblemDescription { get; set; } = string.Empty;
    public string Status { get; set; } = "pending";
    public string? Notes { get; set; }
}
