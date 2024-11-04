using Entities;

namespace Shared.Services.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);

        bool ValidateCurrentToken(string token);

        string GetClaim(string token, string claimType);
    }
}