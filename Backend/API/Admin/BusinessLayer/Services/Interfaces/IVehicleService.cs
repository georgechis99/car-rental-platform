using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Entities;
using Shared.Enums;

namespace Admin.BusinessLayer.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<Vehicle> GetVehicleByIdAsync(int id);

        Task<Vehicle> UpdateVehicleAsync(Vehicle updatedvehicle);
        Task<VehicleToReturnDto> GetVehicleToReturnByIdAsync(int id);
        Task<IEnumerable<VehicleDetailsDto>> GetVehiclesDetailsForOwnerIdAsync(string ownerId);

        Task<IEnumerable<Discount>>GetDiscountsForVehicleAsync(int id, DiscountType discountType);

        Task<IEnumerable<Discount>> UpdateDiscounts(IEnumerable<Discount>? discounts, int vehicleId);

        Task<IEnumerable<VehicleInsuranceDetailsDto>> GetVehicleInsuranceDetailsAsync(int vehicleId);

        Task<IEnumerable<InsuranceType>> GetInsuranceTypesAsync();

        Task<IEnumerable<VehicleInsuranceDetails>> UpdateVehicleInsuranceDetails(IEnumerable<VehicleInsuranceDetails>? vehicleInsuranceDetails, int vehicleId);

        Task<IEnumerable<Location>> GetLocationsAsync();

        Task<IEnumerable<PickupDropoffLocation>> GetPickupDropoffLocationsForOwnerId(string ownerId);

        Task<string> GetLocationNameById(int locationId);
    }
}
