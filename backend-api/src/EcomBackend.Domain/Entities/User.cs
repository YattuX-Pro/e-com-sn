namespace EcomBackend.Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = "viewer";
    public string Status { get; set; } = "active";
    public string PasswordHash { get; set; } = string.Empty;
}
