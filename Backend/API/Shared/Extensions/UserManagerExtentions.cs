using System.Security.Claims;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Shared.Extensions
{
    public static class UserManagerExtentions
    {
        public static async Task<AppUser> FindByIdFromClaimsPrinciple(this UserManager<AppUser> input,
        ClaimsPrincipal user)
        {
            var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

            return await input.Users.SingleOrDefaultAsync(x => x.Id == userId);
        }

        public static async Task<string> GetUserRole(this UserManager<AppUser> input, AppUser user)
        {
            var allRoles = await input.GetRolesAsync(user);
            return allRoles.AsEnumerable().FirstOrDefault();
        }
    }
}