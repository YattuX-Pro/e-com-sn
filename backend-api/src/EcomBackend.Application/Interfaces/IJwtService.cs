using EcomBackend.Domain.Entities;

namespace EcomBackend.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}
