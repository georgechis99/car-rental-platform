using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Entities;
using Shared.Helpers;

namespace API.BusinessLayer.Interfaces
{
    public interface IVehicleService
    {
        Task<Tuple<IEnumerable<VehicleToReturnDto>, int>> GetVehiclesAsync(VehicleSearchParams vehicleParams);

        Task<Vehicle> GetVehicleByIdAsync(int id);

        Task<VehicleToReturnDto> GetDiscountedVehicleToReturnByIdAsync(int id, DateTime pickupDate,DateTime dropoffDate, int pickupLocationId, int dropoffLocationId);

        Task<VehicleToReturnDto> GetVehicleToReturnByIdAsync(int id);

        Task<IEnumerable<VehicleBrand>> GetBrandsAsync();

        Task<IEnumerable<VehicleModel>> GetModelsAsync();

        Task<IEnumerable<VehicleModel>> GetModelsByBrandIdAsync(int brandId);

        Task<IEnumerable<Category>> GetCategoriesAsync();

        Task<IEnumerable<Location>> GetLocationsAsync();

        Task<Location> GetLocationByIdAsync(int id);

        Task<PickupDropoffLocation> GetPickupDropoffLocationAsync(int locationId, int vehicleId, bool isPickup);
        
        Task<IEnumerable<VehicleInsuranceDetailsDto>> GetVehicleInsuranceDetailsAsync(int vehicleId);

        Task<VehicleInsuranceDetails> GetVehicleInsuranceDetailByVehicleIdAndName(int vehicleId, string insuranceTypeName);

        Task<IEnumerable<PriceRange>> GetVehiclePriceRangesAsync();
    }
}
