using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Enums;
using Shared.Errors;
using Shared.Helpers;
using Shared.RentDb.Interfaces;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Shared.RentDb.Repositories
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly RentDbContext context;

        public VehicleRepository(RentDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<int>> GetAvailableVehiclesIdsAsync(DateTime pickupDate, DateTime dropoffDate)
        {
            var bookedVehicleIds = await context.Bookings
                .Where(b => !(pickupDate >= b.DropoffDate || dropoffDate <= b.PickupDate))
                .Select(b => b.PickupLocation.VehicleId)
                .ToListAsync();

            var allVehicleIds = await context.Vehicles
                .Select(v => v.Id)
                .ToListAsync();

            var availableVehicleIds = allVehicleIds.Except(bookedVehicleIds);

            return availableVehicleIds;
        }

        public async Task<Tuple<IEnumerable<Vehicle>, int>> GetVehiclesAsync(VehicleSearchParams vehicleParams)
        {
            var availableVehicleIds = new List<int>();

            if (vehicleParams.PickupDate.HasValue && vehicleParams.DropoffDate.HasValue)
            {
                availableVehicleIds = (await GetAvailableVehiclesIdsAsync(vehicleParams.PickupDate.Value, vehicleParams.DropoffDate.Value)).ToList();
            }

            int days = ((TimeSpan)(vehicleParams.DropoffDate - vehicleParams.PickupDate)).Days;

            List<Vehicle> vehicles = context.Vehicles
                 .Include(v => v.VehicleModel.VehicleBrand)
                 .Include(v => v.VehicleModel)
                 .Include(v => v.PickupDropoffLocations)
                 .Include(v => v.CategoryWithVehicles)
                 .Where(v => v.IsAvailable &&
                             (!availableVehicleIds.Any() || availableVehicleIds.Contains(v.Id))).AsSplitQuery().ToList();

            vehicles = this.FilterVehiclesBySearch(vehicles, vehicleParams.Search);
            vehicles = this.FilterVehiclesByBrand(vehicles, vehicleParams.BrandId);
            vehicles = this.FilterVehiclesByModel(vehicles, vehicleParams.ModelId);
            vehicles = this.FilterVehiclesByPickupLocation(vehicles, vehicleParams.PickupLocationId);
            vehicles = this.FilterVehiclesByDropoffLocation(vehicles, vehicleParams.DropoffLocationId);
            vehicles = this.FilterVehiclesByPriceRanges(vehicles, vehicleParams.PriceRanges, days);
            vehicles = this.FilterVehiclesByCategories(vehicles, vehicleParams.Categories);
            vehicles = this.FilterVehiclesByTransmissionType(vehicles, vehicleParams.TransmissionTypes);

            foreach (var vehicle in vehicles)
            {
                vehicle.PickupDropoffLocations = vehicle.PickupDropoffLocations
                    .Where(pdl => pdl.LocationId == vehicleParams.PickupLocationId || pdl.LocationId == vehicleParams.DropoffLocationId)
                    .ToList();
            }

            var totalCount = vehicles.Count;

            var query = vehicles.AsQueryable();

            switch (vehicleParams.Sort)
            {
                case "priceAsc":
                    query = query.OrderBy(p => p.Price);
                    break;

                case "priceDesc":
                    query = query.OrderByDescending(p => p.Price);
                    break;

                default:
                    query = query.OrderBy(p => p.VehicleModel.Name)
                                 .ThenBy(p => p.VehicleModel.VehicleBrand.Name);
                    break;
            }

            query = query.Skip(vehicleParams.PageSize * (vehicleParams.PageNumber - 1)).Take(vehicleParams.PageSize);

            List<Vehicle> result = await EnumerableMapper.AsAsyncEnumerable(query).ToListAsync();

            return new Tuple<IEnumerable<Vehicle>, int>(result, totalCount);
        }

        public async Task<IEnumerable<Vehicle>> GetVehiclesForUserIdAsync(string id)
        {
            return await context.Vehicles
                .Include(v => v.VehicleModel)
                .Include(v => v.VehicleModel.VehicleBrand)
                .Where(v => v.OwnerId == id)
                .ToListAsync();
        }

        public async Task<Vehicle> GetVehicleByIdAsync(int id)
        {
            return await context.Vehicles
                .Include(p => p.VehicleModel.VehicleBrand)
                .Include(p => p.VehicleModel)
                .Include(p => p.PickupDropoffLocations)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Vehicle> UpdateVehicleAsync(Vehicle updatedVehicle)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    var existingVehicle = await context.Vehicles.FindAsync(updatedVehicle.Id);
                    context.Entry(existingVehicle).CurrentValues.SetValues(updatedVehicle);
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    var updatedEntity = await context.Vehicles.FindAsync(updatedVehicle.Id);
                    return updatedEntity;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task UpdateDiscounts(List<Discount>? discountsToUpdate)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var discount in discountsToUpdate)
                    {
                        var existingDiscount = await context.Discounts.FindAsync(discount.Id);
                        context.Entry(existingDiscount).CurrentValues.SetValues(discount);
                    }
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    return;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task AddDiscounts(IEnumerable<Discount> discountsToAdd)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var discount in discountsToAdd)
                    {
                        await context.Discounts.AddAsync(discount);
                    }
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    return;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task RemoveDiscounts(List<Discount> discountsToremove)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var discount in discountsToremove)
                    {
                        context.Discounts.Remove(discount);
                    }
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    return;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task UpdateVehicleInsuranceDetails(List<VehicleInsuranceDetails>? insuranceDetailsToUpdate)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var detail in insuranceDetailsToUpdate)
                    {
                        var existingDetail = await context.VehicleInsuranceDetails.FindAsync(detail.Id);
                        context.Entry(existingDetail).CurrentValues.SetValues(detail);
                    }
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    return;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task AddVehicleInsuranceDetails(IEnumerable<VehicleInsuranceDetails> insuranceDetailsToAdd)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var detail in insuranceDetailsToAdd)
                    {
                        await context.VehicleInsuranceDetails.AddAsync(detail);
                    }
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    return;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task RemoveVehicleInsuranceDetails(List<VehicleInsuranceDetails> insuranceDetailsToRemove)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    foreach (var detail in insuranceDetailsToRemove)
                    {
                        context.VehicleInsuranceDetails.Remove(detail);
                    }
                    await context.SaveChangesAsync();
                    transaction.Commit();

                    return;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task<IEnumerable<VehicleBrand>> GetBrandsAsync()
        {
            return await context.VehicleBrands.ToListAsync();
        }

        public async Task<IEnumerable<VehicleModel>> GetModelsAsync()
        {
            return await context.VehicleModels.ToListAsync();
        }

        public async Task<IEnumerable<VehicleModel>> GetModelsByBrandIdAsync(int brandId)
        {
            return await context.VehicleModels.Where(m => brandId == 0 || m.VehicleBrandId == brandId).ToListAsync();
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            return await context.Categories.ToListAsync();
        }

        public async Task<IEnumerable<PriceRange>> GetVehiclePriceRangesAsync()
        {
            return await context.PriceRanges.ToListAsync();
        }

        public async Task<IEnumerable<Location>> GetLocationsAsync()
        {
            return await context.Locations.ToListAsync();
        }

        public async Task<string> GetLocationNameByIdAsync(int locationId)
        {
            var location = await context.Locations
                .FirstOrDefaultAsync(l => l.Id == locationId);

            return location.Name;
        }

        public async Task<Location> GetLocationByIdAsync(int id)
        {
            return await context.Locations
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<PickupDropoffLocation> GetPickupDropoffLocationAsync(int locationId, int vehicleId, bool isPickup)
        {
            return await context.PickupDropoffLocations.Where(p => p.LocationId == locationId && p.VehicleId == vehicleId && p.isPickup == isPickup).Include(p => p.Location).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<VehicleInsuranceDetails>> GetVehicleInsuranceDetailsAsync(int vehicleId)
        {
            return await context.VehicleInsuranceDetails.Where(v => v.VehicleId == vehicleId).Include(v => v.Vehicle).Include(i => i.InsuranceType).ToListAsync();
        }

        public async Task<VehicleInsuranceDetails> GetVehicleInsuranceDetailByVehicleIdAndName(int vehicleId, string InsuranceDetailTypeName)
        {
            return await context.VehicleInsuranceDetails.Where(v => v.VehicleId == vehicleId).Where(i => i.InsuranceType.Name == InsuranceDetailTypeName).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Discount>> GetAllDiscountsForVehicleAsync(int vehicleId)
        {
            return await context.Discounts.Where(d => d.VehicleId == vehicleId).ToListAsync();
        }

        public async Task<IEnumerable<Discount>> GetIntervalDiscountsForVehicleAsync(int vehicleId)
        {
            return await context.Discounts.Where(d => d.VehicleId == vehicleId).Where(d => d.DiscountType == DiscountType.BasedOnBookingIntervalLength).ToListAsync();
        }

        public async Task<IEnumerable<Discount>> GetMonthDiscountsForVehicleAsync(int vehicleId)
        {
            return await context.Discounts.Where(d => d.VehicleId == vehicleId).Where(d => d.DiscountType == DiscountType.BasedOnMonth).ToListAsync();
        }

        public async Task<IEnumerable<InsuranceType>> GetInsuranceTypesAsync()
        {
            return await context.InsuranceTypes.ToListAsync();
        }

        public async Task<IEnumerable<PickupDropoffLocation>> GetPickupDropoffLocationsForVehicles(IEnumerable<int> vehicleIds)
        {
            var result = await context.PickupDropoffLocations.Where(pdl => vehicleIds.Contains(pdl.VehicleId)).ToListAsync();
            return result;
        }

        private List<Vehicle> FilterVehiclesBySearch(List<Vehicle> vehicles, string search)
        {
            return vehicles.Where(v => string.IsNullOrEmpty(search)
                             || v.VehicleModel.VehicleBrand.Name.ToLower().Contains(search)
                             || v.VehicleModel.Name.ToLower().Contains(search)).ToList();
        }

        private List<Vehicle> FilterVehiclesByBrand(List<Vehicle> vehicles, int? brandId)
        {
            return vehicles.Where(v => !brandId.HasValue || brandId == 0 || v.VehicleModel.VehicleBrandId == brandId).ToList();
        }

        private List<Vehicle> FilterVehiclesByModel(List<Vehicle> vehicles, int? modelId)
        {
            return vehicles.Where(v => !modelId.HasValue || modelId == 0 || v.VehicleModel.Id == modelId).ToList();
        }

        private List<Vehicle> FilterVehiclesByPickupLocation(List<Vehicle> vehicles, int? pickupLocationId)
        {
            return vehicles.Where(v => !pickupLocationId.HasValue || v.PickupDropoffLocations.Where(p => p.isPickup == true).Any(l => l.LocationId == pickupLocationId)).ToList();
        }

        private List<Vehicle> FilterVehiclesByDropoffLocation(List<Vehicle> vehicles, int? dropoffLocationId)
        {
            return vehicles.Where(v => !dropoffLocationId.HasValue || v.PickupDropoffLocations.Where(p => p.isPickup == false).Any(l => l.LocationId == dropoffLocationId)).ToList();
        }

        private List<Vehicle> FilterVehiclesByPriceRanges(List<Vehicle> vehicles, IEnumerable<PriceRange>? priceRanges, int noOfDays)
        {
            return vehicles.Where(v => priceRanges is null || !priceRanges.Any() || priceRanges.Any(pr => pr.LowValue == pr.HighValue ? (v.Price * noOfDays) >= pr.HighValue : ((v.Price * noOfDays) >= pr.LowValue && (v.Price * noOfDays) <= pr.HighValue))).ToList();
        }

        private List<Vehicle> FilterVehiclesByCategories(List<Vehicle> vehicles, IEnumerable<Category>? categories)
        {
            return vehicles.Where(v => categories is null || !categories.Any() || categories.Any(c => v.CategoryWithVehicles.Any(cv => cv.CategoryId == c.Id && cv.VehicleId == v.Id))).ToList();
        }

        private List<Vehicle> FilterVehiclesByTransmissionType(List<Vehicle> vehicles, IEnumerable<string> transmissionTypes)
        {
            return vehicles.Where(v => transmissionTypes is null || !transmissionTypes.Any() || transmissionTypes.Any(t => v.TransmissionType.ToLower() == t.ToLower())).ToList();
        }
    }

    internal static class EnumerableMapper
    {
        public static IAsyncEnumerable<T> AsAsyncEnumerable<T>(this IEnumerable<T> input)
        {
            return InternalAsync();

            async IAsyncEnumerable<T> InternalAsync()
            {
                foreach (var value in input)
                {
                    yield return value;
                    await Task.Yield(); // Add this to ensure it's truly asynchronous.
                }
            }
        }
    }

}
