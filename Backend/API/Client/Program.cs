using Helpers;
using Microsoft.EntityFrameworkCore;
using API.Extentions;
using Microsoft.AspNetCore.Identity;
using Entities;
using System.Text.Json.Serialization;
using Shared.RentDb;
using Shared.Identity;
using Shared.SeedData;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddAutoMapper(typeof(MappingProfiles));
        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.JsonSerializerOptions.WriteIndented = true;
        });

        builder.Services.AddDbContext<RentDbContext>(x =>
        {
            x.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
            b => b.MigrationsAssembly("Client"));
        });


        builder.Services.AddDbContext<AppIdentityDbContext>(x =>
        {
            x.UseSqlServer(builder.Configuration.GetConnectionString("IdentityConnection"),
            b => b.MigrationsAssembly("Client"));
        });

        builder.Services.AddDefaultIdentity<AppUser>(options =>
        {
            options.SignIn.RequireConfirmedAccount = false;
        }
        )
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppIdentityDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.AddApplicationServices(builder.Configuration);
        builder.Services.AddIdentityServices(builder.Configuration);

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        builder.Services.AddCors(opt =>
        {
            opt.AddPolicy("DevCorsPolicy", policy =>
            {
                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:4200");
                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200");
            });
            opt.AddPolicy("ProdCorsPolicy", policy =>
            {
                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://live-rentacar-client-frontend.azurewebsites.net");
                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://www.rentacaromania.ro");
            });
        });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors("DevCorsPolicy");
        }
        else if (app.Environment.IsProduction())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
            app.UseCors("ProdCorsPolicy");
        }

        app.UseHttpsRedirection();

        app.UseStaticFiles();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();

        using (var scope = app.Services.CreateScope())
        {
            var services = scope.ServiceProvider;
            var context = services.GetRequiredService<RentDbContext>();
            var logger = services.GetRequiredService<ILogger<Program>>();

            try
            {
                await context.Database.MigrateAsync();
                await RentDbContextSeed.SeedAsync(context);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "An error occured during database migration or seeding.");
            }
        }

        using (var scope = app.Services.CreateScope())
        {
           var roleManager = scope.ServiceProvider
               .GetRequiredService<RoleManager<IdentityRole>>();

           var roles = new[] { "User", "Business" };

           foreach (var role in roles)
           {
               if (!await roleManager.RoleExistsAsync(role))
               {
                   await roleManager.CreateAsync(new IdentityRole(role));
               }
           }

           var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

           string guestEmail = "george.chis2014@gmail.com";
           string guestPassword = "Pa$$w0rd";

           if (await userManager.FindByEmailAsync(guestEmail) == null)
           {
               var user = new AppUser
               {
                   UserName = guestEmail,
                   Email = guestEmail,
               };

               await userManager.CreateAsync(user, guestPassword);

               await userManager.AddToRoleAsync(user, "User");

           }

           string ownerEmail = "owner1@gmail.com";
           string ownerPassword = "Pa$$w0rd";

           if (await userManager.FindByEmailAsync(ownerEmail) == null)
           {
               var user = new AppUser
               {
                   UserName = ownerEmail,
                   Email = ownerEmail,
               };

               await userManager.CreateAsync(user, ownerPassword);

               await userManager.AddToRoleAsync(user, "Business");

           }
        }

        app.Run();
    }
}
