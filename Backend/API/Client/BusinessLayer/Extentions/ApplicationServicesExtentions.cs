using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.BusinessLayer.Interfaces;
using API.BusinessLayer.Services;
using API.BusinessLayer.Services.Validation.Interfaces;
using API.BusinessLayer.Services.Validation;
using Shared.RentDb;
using Shared.RentDb.Interfaces;
using Shared.RentDb.Repositories;
using Shared.Errors;
using Shared.Services.Interfaces;
using Shared.Services;

namespace API.Extentions
{
    public static class ApplicationServicesExtentions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<RentDbContext>(opt =>
            {
                opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
            });

            services.AddScoped<IVehicleRepository, VehicleRepository>();
            services.AddScoped<IVehicleService, VehicleService>();
            services.AddScoped<IBookingRepository, BookingRepository>();
            services.AddScoped<IBookingService, BookingService>();
            services.AddScoped<IBookingValidationService, BookingValidationService>();
            //services.AddScoped<IAccountService, AccountService>();



            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IEmailSender, EmailSender>();
            services.Configure<ApiBehaviorOptions>(options =>
                        {
                            options.InvalidModelStateResponseFactory = actionContext =>
                            {
                                var errors = actionContext.ModelState
                                    .Where(e => e.Value.Errors.Count > 0)
                                    .SelectMany(x => x.Value.Errors)
                                    .Select(x => x.ErrorMessage).ToArray();

                                var errorResponse = new ApiValidationErrorResponse
                                {
                                    Errors = errors
                                };

                                return new BadRequestObjectResult(errorResponse);
                            };
                        });
            return services;
        }
    }
}