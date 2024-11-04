using Shared.Entities;
using Shared.Helpers;

namespace Shared.RentDb.Interfaces
{
    public interface IVehicleRepository
    {

        Task<Vehicle> UpdateVehicleAsync(Vehicle updatedVehicle);
        Task<IEnumerable<int>> GetAvailableVehiclesIdsAsync(DateTime pickupDate, DateTime dropoffDate);

        Task<Tuple<IEnumerable<Vehicle>, int>> GetVehiclesAsync(VehicleSearchParams vehicleParams);

        Task<Vehicle> GetVehicleByIdAsync(int id);

        Task<IEnumerable<Vehicle>> GetVehiclesForUserIdAsync(string id);

        Task<IEnumerable<VehicleBrand>> GetBrandsAsync();

        Task<IEnumerable<VehicleModel>> GetModelsAsync();

        Task<IEnumerable<VehicleModel>> GetModelsByBrandIdAsync(int brandId);

        Task<IEnumerable<Category>> GetCategoriesAsync();

        Task<IEnumerable<Location>> GetLocationsAsync();

        Task<string> GetLocationNameByIdAsync(int locationId);

        Task<Location> GetLocationByIdAsync(int id);

        Task<PickupDropoffLocation> GetPickupDropoffLocationAsync(int locationId, int vehicleId, bool isPickup);

        Task<IEnumerable<VehicleInsuranceDetails>> GetVehicleInsuranceDetailsAsync(int vehicleId);

        Task<VehicleInsuranceDetails> GetVehicleInsuranceDetailByVehicleIdAndName(int vehicleId, string InsuranceDetailTypeName);

        Task<IEnumerable<Discount>> GetAllDiscountsForVehicleAsync(int vehicleId);

        Task<IEnumerable<Discount>> GetIntervalDiscountsForVehicleAsync(int vehicleId);

        Task<IEnumerable<Discount>> GetMonthDiscountsForVehicleAsync(int vehicleId);

        Task UpdateDiscounts(List<Discount> discountsToUpdate);
        Task AddDiscounts(IEnumerable<Discount> discountsToAdd);
        Task RemoveDiscounts(List<Discount> discountsToremoveIds);

        Task UpdateVehicleInsuranceDetails(List<VehicleInsuranceDetails>? insuranceDetailsToUpdate);
        Task AddVehicleInsuranceDetails(IEnumerable<VehicleInsuranceDetails>? insuranceDetailsToUpdate);
        Task RemoveVehicleInsuranceDetails(List<VehicleInsuranceDetails>? insuranceDetailsToUpdate);

        Task<IEnumerable<InsuranceType>> GetInsuranceTypesAsync();
        Task<IEnumerable<PriceRange>> GetVehiclePriceRangesAsync();

        Task<IEnumerable<PickupDropoffLocation>> GetPickupDropoffLocationsForVehicles(IEnumerable<int> vehicleIds);
    }
}
