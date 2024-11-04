using Admin.BusinessLayer.Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Entities;
using Shared.Enums;
using Shared.RentDb.Interfaces;

namespace Admin.BusinessLayer.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly IVehicleRepository vehicleRepository;
        private readonly IMapper mapper;

        public VehicleService(IVehicleRepository vehicleRepository, IMapper mapper)
        {
            this.vehicleRepository = vehicleRepository;
            this.mapper = mapper;
        }

        public async Task<Vehicle> GetVehicleByIdAsync(int id)
        {
            return await this.vehicleRepository.GetVehicleByIdAsync(id);
        }

        public async Task<VehicleToReturnDto> GetVehicleToReturnByIdAsync(int id)
        {
            var vehicle = await this.vehicleRepository.GetVehicleByIdAsync(id);
            return mapper.Map<VehicleToReturnDto>(vehicle);
        }

        public async Task<IEnumerable<VehicleDetailsDto>> GetVehiclesDetailsForOwnerIdAsync(string ownerId)
        {
            var vehicles = await this.vehicleRepository.GetVehiclesForUserIdAsync(ownerId);
            return mapper.Map<IEnumerable<VehicleDetailsDto>>(vehicles);
        }

        public async Task<Vehicle> UpdateVehicleAsync(Vehicle updatedvehicle)
        {
            return await this.vehicleRepository.UpdateVehicleAsync(updatedvehicle);
        }

        public async Task<IEnumerable<Discount>> GetDiscountsForVehicleAsync(int id, DiscountType discountType)
        {
            var discounts = new List<Discount>();
            if(discountType == DiscountType.BasedOnBookingIntervalLength)
            {
                discounts = (List<Discount>)await this.GetIntervalDiscountsForVehicleAsync(id);
            } else if(discountType == DiscountType.BasedOnMonth)
            {
                discounts = (List<Discount>)await this.GetMonthDiscountsForVehicleAsync(id);
            }

            return discounts;
        }

        public async Task<IEnumerable<Discount>> UpdateDiscounts(IEnumerable<Discount>? discounts, int vehicleId)
        {
            var discountsForVehicle = await vehicleRepository.GetAllDiscountsForVehicleAsync(vehicleId);

            var discountsToUpdate = new List<Discount>();
            var discountsToAdd = new List<Discount>();
            var discountsToRemove = new List<Discount>();

            foreach (var updatedDiscount in discounts)
            {
                var existingDiscount = discountsForVehicle.FirstOrDefault(d => d.Id == updatedDiscount.Id);
                if (existingDiscount != null)
                {
                    if (!AreDiscountsEqual(existingDiscount, updatedDiscount))
                    {
                        discountsToUpdate.Add(updatedDiscount);
                    }
                }
                else
                {
                    discountsToAdd.Add(updatedDiscount);
                }
            }

            foreach (var existingDiscount in discountsForVehicle)
            {
                if (!discounts.Any(d => d.Id == existingDiscount.Id))
                {
                    discountsToRemove.Add(existingDiscount);
                }
            }

            await vehicleRepository.UpdateDiscounts(discountsToUpdate);
            await vehicleRepository.AddDiscounts(discountsToAdd);
            await vehicleRepository.RemoveDiscounts(discountsToRemove);

            var updatedDiscounts = await vehicleRepository.GetAllDiscountsForVehicleAsync(discounts.First().VehicleId);
            return updatedDiscounts;
        }

        public async Task<IEnumerable<VehicleInsuranceDetails>> UpdateVehicleInsuranceDetails(IEnumerable<VehicleInsuranceDetails>? vehicleInsuranceDetails, int vehicleId)
        {
            await vehicleRepository.UpdateVehicleInsuranceDetails(vehicleInsuranceDetails.ToList());

            var updatedInsuranceDetails = await vehicleRepository.GetVehicleInsuranceDetailsAsync(vehicleId);
            return updatedInsuranceDetails;
        }


        private bool AreDiscountsEqual(Discount discount1, Discount discount2)
        {
            return discount1.VehicleId == discount2.VehicleId &&
                   discount1.DiscountType == discount2.DiscountType &&
                   discount1.Month == discount2.Month &&
                   discount1.IntervalStartInDays == discount2.IntervalStartInDays &&
                   discount1.IntervalEndInDays == discount2.IntervalEndInDays &&
                   discount1.DiscountPercentage == discount2.DiscountPercentage;
        }

        private async Task<IEnumerable<Discount>> GetIntervalDiscountsForVehicleAsync(int vehicleId)
        {
            return await this.vehicleRepository.GetIntervalDiscountsForVehicleAsync(vehicleId);
        }

        private async Task<IEnumerable<Discount>> GetMonthDiscountsForVehicleAsync(int vehicleId)
        {
            return await this.vehicleRepository.GetMonthDiscountsForVehicleAsync(vehicleId);
        }

        public async Task<IEnumerable<VehicleInsuranceDetailsDto>> GetVehicleInsuranceDetailsAsync(int vehicleId)
        {
            var vehicleInsuranceDetails = await this.vehicleRepository.GetVehicleInsuranceDetailsAsync(vehicleId);
            return mapper.Map<IEnumerable<VehicleInsuranceDetailsDto>>(vehicleInsuranceDetails);
        }

        public async Task<IEnumerable<InsuranceType>> GetInsuranceTypesAsync()
        {
            var vehicleInsuranceTypes = await vehicleRepository.GetInsuranceTypesAsync();
            return vehicleInsuranceTypes;
        }

        public async Task<IEnumerable<Location>> GetLocationsAsync()
        {
            return await this.vehicleRepository.GetLocationsAsync();
        }

        public async Task<string> GetLocationNameById(int locationId)
        {
            return await this.vehicleRepository.GetLocationNameByIdAsync(locationId);
        }

        public async Task<IEnumerable<PickupDropoffLocation>> GetPickupDropoffLocationsForOwnerId(string ownerId)
        {
            var ownerVehicles = await this.vehicleRepository.GetVehiclesForUserIdAsync(ownerId);

            var vehicleIds = ownerVehicles.Select(ov => ov.Id);

            var pickupDropoffLocations = await this.vehicleRepository.GetPickupDropoffLocationsForVehicles(vehicleIds);

            return pickupDropoffLocations;
        }
    }
}