using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.RentDb;
using System.Reflection;
using System.Text.Json;

namespace Shared.SeedData
{
    public class RentDbContextSeed
    {
        public static async Task<Task> SeedAsync(RentDbContext context)
        {
            var path = "/Users/George.Chis/Downloads/appz/RentACar/Backend/API/Shared/RentDb";

            try
            {
                if (!context.PriceRanges.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var priceRangesData = File.ReadAllText(path + @"/SeedData/price_ranges.json");
                        var priceRanges = JsonSerializer.Deserialize<List<PriceRange>>(priceRangesData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[PriceRanges] ON;");

                        foreach (var priceRange in priceRanges)
                        {
                            context.PriceRanges.Add(priceRange);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[PriceRanges] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.Locations.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var locationsData = File.ReadAllText(path + @"/SeedData/locations.json");
                        var locations = JsonSerializer.Deserialize<List<Location>>(locationsData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Locations] ON;");

                        foreach (var location in locations)
                        {
                            context.Locations.Add(location);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Locations] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.Categories.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var categoriesData = File.ReadAllText(path + @"/SeedData/categories.json");
                        var categories = JsonSerializer.Deserialize<List<Category>>(categoriesData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Categories] ON;");

                        foreach (var category in categories)
                        {
                            context.Categories.Add(category);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Categories] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.VehicleBrands.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var brandsData = File.ReadAllText(path + @"/SeedData/vehicle_brands.json");
                        var brands = JsonSerializer.Deserialize<List<VehicleBrand>>(brandsData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleBrands] ON;");

                        foreach (var brand in brands)
                        {
                            context.VehicleBrands.Add(brand);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleBrands] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.VehicleModels.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var modelsData = File.ReadAllText(path + @"/SeedData/vehicle_models.json");
                        var models = JsonSerializer.Deserialize<List<VehicleModel>>(modelsData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleModels] ON");

                        foreach (var model in models)
                        {
                            context.VehicleModels.Add(model);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleModels] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.InsuranceTypes.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var insuranceTypesData = File.ReadAllText(path + @"/SeedData/insurance_types.json");
                        var insurances = JsonSerializer.Deserialize<List<InsuranceType>>(insuranceTypesData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[InsuranceTypes] ON");

                        foreach (var insurance in insurances)
                        {
                            context.InsuranceTypes.Add(insurance);

                            Console.WriteLine(insurance);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[InsuranceTypes] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.Vehicles.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var vehiclesData = File.ReadAllText(path + @"/SeedData/vehicles.json");
                        var vehicles = JsonSerializer.Deserialize<List<Vehicle>>(vehiclesData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Vehicles] ON");

                        foreach (var vehicle in vehicles)
                        {
                            context.Vehicles.Add(vehicle);

                            Console.WriteLine(vehicle);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Vehicles] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.VehicleInsuranceDetails.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var vehicleInsuranceDetailsData = File.ReadAllText(path + @"/SeedData/vehicle_insurance_details.json");
                        var vehicleInsuranceDetails = JsonSerializer.Deserialize<List<VehicleInsuranceDetails>>(vehicleInsuranceDetailsData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleInsuranceDetails] ON");

                        foreach (var vehicleInsurance in vehicleInsuranceDetails)
                        {
                            context.VehicleInsuranceDetails.Add(vehicleInsurance);

                            Console.WriteLine(vehicleInsurance);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleInsuranceDetails] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.CategoryWithVehicles.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var vehicleWithCategoriesData = File.ReadAllText(path + @"/SeedData/vehicle_with_categories.json");
                        var vehicleWithCategories = JsonSerializer.Deserialize<List<CategoryWithVehicle>>(vehicleWithCategoriesData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[CategoryWithVehicles] ON;");

                        foreach (var categoryWithVehicle in vehicleWithCategories)
                        {
                            context.CategoryWithVehicles.Add(categoryWithVehicle);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[CategoryWithVehicles] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.PickupDropoffLocations.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var pickupDropoffLocationsData = File.ReadAllText(path + @"/SeedData/pickup_dropoff_locations.json");
                        var pickupDropoffLocations = JsonSerializer.Deserialize<List<PickupDropoffLocation>>(pickupDropoffLocationsData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[PickupDropoffLocations] ON");

                        foreach (var pickupDropoffLocation in pickupDropoffLocations)
                        {
                            context.PickupDropoffLocations.Add(pickupDropoffLocation);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[PickupDropoffLocations] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.Bookings.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var bookingsData = File.ReadAllText(path + @"/SeedData/bookings.json");
                        var bookings = JsonSerializer.Deserialize<List<Booking>>(bookingsData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Bookings] ON");

                        foreach (var booking in bookings)
                        {
                            context.Bookings.Add(booking);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Bookings] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.VehicleUnavailabilities.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var unavailabilitiesData = File.ReadAllText(path + @"/SeedData/vehicle_unavailabilities.json");
                        var unavailabilities = JsonSerializer.Deserialize<List<VehicleUnavailability>>(unavailabilitiesData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleUnavailabilities] ON");

                        foreach (var unavailability in unavailabilities)
                        {
                            context.VehicleUnavailabilities.Add(unavailability);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[VehicleUnavailabilities] OFF;");
                        transaction.Commit();
                    }
                }

                if (!context.Discounts.Any())
                {
                    using (var transaction = context.Database.BeginTransaction())
                    {
                        var discountsData = File.ReadAllText(path + @"/SeedData/discounts.json");
                        var discounts = JsonSerializer.Deserialize<List<Discount>>(discountsData);

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Discounts] ON;");

                        foreach (var discount in discounts)
                        {
                            context.Discounts.Add(discount);
                        }

                        await context.SaveChangesAsync();

                        context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT [dbo].[Discounts] OFF;");
                        transaction.Commit();
                    }
                }

                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
