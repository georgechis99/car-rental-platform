using AutoMapper;
using API.BusinessLayer.Interfaces;
using Shared.Dtos;
using Shared.Entities;
using Shared.Helpers;
using Shared.RentDb.Interfaces;
using Shared.Enums;

namespace API.BusinessLayer.Services
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

        public async Task<Tuple<IEnumerable<VehicleToReturnDto>, int>> GetVehiclesAsync(VehicleSearchParams vehicleParams)
        {
            var result = await this.vehicleRepository.GetVehiclesAsync(vehicleParams);
            var vehicles = result.Item1;
            var totalCount = result.Item2;
            var mappedVehicles = mapper.Map<IEnumerable<VehicleToReturnDto>>(vehicles);
            var discountedVehicles = await this.ApplyDiscountToListOfMappedVehicles(mappedVehicles, vehicleParams);
            return new Tuple<IEnumerable<VehicleToReturnDto>, int>(discountedVehicles, totalCount);
        }

        private async Task<IEnumerable<VehicleToReturnDto>> ApplyDiscountToListOfMappedVehicles(IEnumerable<VehicleToReturnDto> mappedVehicles, VehicleSearchParams vehicleParams)
        {
            var discountedVehicles = new List<VehicleToReturnDto>();
            foreach (var vehicle in mappedVehicles)
            {
                int days = ((TimeSpan)(vehicleParams.DropoffDate - vehicleParams.PickupDate)).Days;
                var allDiscounts = await this.vehicleRepository.GetAllDiscountsForVehicleAsync(vehicle.Id);
                double activeDiscountPercentage = 0;
                foreach (var discount in allDiscounts)
                {
                    if (discount.DiscountType == DiscountType.BasedOnBookingIntervalLength)
                    {
                        if (discount.IntervalStartInDays <= days && days <= discount.IntervalEndInDays)
                        {
                            if (activeDiscountPercentage + discount.DiscountPercentage >= 100)
                            {
                                activeDiscountPercentage = 100;
                            }
                            else
                            {
                                activeDiscountPercentage += discount.DiscountPercentage;
                            }
                        }
                    }

                    if (discount.DiscountType == DiscountType.BasedOnMonth && (int)discount.Month == vehicleParams.PickupDate.Value.Month)
                    {
                        if (activeDiscountPercentage + discount.DiscountPercentage >= 100)
                        {
                            activeDiscountPercentage = 100;
                        }
                        else
                        {
                            activeDiscountPercentage += discount.DiscountPercentage;
                        }
                    }
                }
                if (activeDiscountPercentage > 0)
                {
                    vehicle.DiscountPercentage = activeDiscountPercentage;
                    vehicle.DiscountedPrice = vehicle.Price - (vehicle.Price * (decimal)activeDiscountPercentage / 100);
                    vehicle.TotalPrice = vehicle.DiscountedPrice * days;
                    vehicle.TotalPriceWithoutDiscounts = vehicle.Price * days;
                }
                else
                {
                    vehicle.DiscountPercentage = 0;
                    vehicle.DiscountedPrice = vehicle.Price;
                    vehicle.TotalPrice = vehicle.Price * days;
                    vehicle.TotalPriceWithoutDiscounts = vehicle.TotalPrice;
                }

                if (vehicle.TotalPrice < 0)
                {
                    vehicle.DiscountPercentage = 100;
                    vehicle.DiscountedPrice = 0;
                    vehicle.TotalPrice = 0;
                }
                discountedVehicles.Add(vehicle);
            }
            return discountedVehicles;
        }

        public async Task<Vehicle> GetVehicleByIdAsync(int id)
        {
            return await this.vehicleRepository.GetVehicleByIdAsync(id);
        }

        public async Task<VehicleToReturnDto> GetDiscountedVehicleToReturnByIdAsync(int id, DateTime PickupDate, DateTime DropoffDate, int pickupLocationId, int dropoffLocationId)
        {
            var vehicle = await this.vehicleRepository.GetVehicleByIdAsync(id);

            vehicle.PickupDropoffLocations = vehicle.PickupDropoffLocations
                    .Where(pdl => (pdl.LocationId == pickupLocationId && pdl.isPickup == true) || (pdl.LocationId == dropoffLocationId && pdl.isPickup == false)).ToList();

            var mappedVehicle = mapper.Map<VehicleToReturnDto>(vehicle);
            var discountedVehicle = await this.ApplyDiscountToVehicle(mappedVehicle, PickupDate, DropoffDate);
            return discountedVehicle;
        }

        public async Task<VehicleToReturnDto> GetVehicleToReturnByIdAsync(int id)
        {
            var vehicle = await this.vehicleRepository.GetVehicleByIdAsync(id);
            return mapper.Map<VehicleToReturnDto>(vehicle);
        }

        private async Task<VehicleToReturnDto> ApplyDiscountToVehicle(VehicleToReturnDto mappedVehicle, DateTime pickupDate, DateTime dropoffDate)
        {
            var discountedVehicle = mappedVehicle;
            int days = ((TimeSpan)(dropoffDate - pickupDate)).Days;
            var allDiscounts = await this.vehicleRepository.GetAllDiscountsForVehicleAsync(discountedVehicle.Id);
            double activeDiscountPercentage = 0;
            foreach (var discount in allDiscounts)
            {
                if (discount.DiscountType == DiscountType.BasedOnBookingIntervalLength)
                {
                    if (discount.IntervalStartInDays <= days && days <= discount.IntervalEndInDays)
                    {
                        if (activeDiscountPercentage + discount.DiscountPercentage >= 100)
                        {
                            activeDiscountPercentage = 100;
                        }
                        else
                        {
                            activeDiscountPercentage += discount.DiscountPercentage;
                        }

                    }
                }

                if (discount.DiscountType == DiscountType.BasedOnMonth && (int)discount.Month == pickupDate.Month)
                {
                    if (activeDiscountPercentage + discount.DiscountPercentage >= 100)
                    {
                        activeDiscountPercentage = 100;
                    }
                    else
                    {
                        activeDiscountPercentage += discount.DiscountPercentage;
                    }
                }
            }
            if (activeDiscountPercentage > 0)
            {
                discountedVehicle.DiscountPercentage = activeDiscountPercentage;
                discountedVehicle.DiscountedPrice = discountedVehicle.Price - (discountedVehicle.Price * (decimal)activeDiscountPercentage / 100);
                discountedVehicle.TotalPrice = discountedVehicle.DiscountedPrice * days;
                discountedVehicle.TotalPriceWithoutDiscounts = discountedVehicle.Price * days;
            }
            else
            {
                discountedVehicle.DiscountPercentage = 0;
                discountedVehicle.DiscountedPrice = discountedVehicle.Price;
                discountedVehicle.TotalPrice = discountedVehicle.Price * days;
                discountedVehicle.TotalPriceWithoutDiscounts = discountedVehicle.TotalPrice;

            };
            if (discountedVehicle.TotalPrice < 0)
            {
                discountedVehicle.DiscountPercentage = 100;
                discountedVehicle.DiscountedPrice = 0;
                discountedVehicle.TotalPrice = 0;
            }
            return discountedVehicle;
        }

        public async Task<IEnumerable<VehicleBrand>> GetBrandsAsync()
        {
            return await this.vehicleRepository.GetBrandsAsync();
        }

        public async Task<IEnumerable<VehicleModel>> GetModelsAsync()
        {
            return await this.vehicleRepository.GetModelsAsync();
        }

        public async Task<IEnumerable<VehicleModel>> GetModelsByBrandIdAsync(int brandId)
        {
            return await this.vehicleRepository.GetModelsByBrandIdAsync(brandId);
        }

        public async Task<IEnumerable<Category>> GetCategoriesAsync()
        {
            return await this.vehicleRepository.GetCategoriesAsync();
        }

        public async Task<IEnumerable<PriceRange>> GetVehiclePriceRangesAsync()
        {
            return await this.vehicleRepository.GetVehiclePriceRangesAsync();
        }

        public async Task<IEnumerable<Location>> GetLocationsAsync()
        {
            return await this.vehicleRepository.GetLocationsAsync();
        }

        public async Task<Location> GetLocationByIdAsync(int id)
        {
            return await this.vehicleRepository.GetLocationByIdAsync(id);
        }

        public async Task<PickupDropoffLocation> GetPickupDropoffLocationAsync(int locationId, int vehicleId, bool isPickup)
        {
            return await this.vehicleRepository.GetPickupDropoffLocationAsync(locationId, vehicleId, isPickup);
        }

        public async Task<IEnumerable<VehicleInsuranceDetailsDto>> GetVehicleInsuranceDetailsAsync(int vehicleId)
        {
            var vehicleInsuranceDetails = await this.vehicleRepository.GetVehicleInsuranceDetailsAsync(vehicleId);
            return mapper.Map<IEnumerable<VehicleInsuranceDetailsDto>>(vehicleInsuranceDetails);
        }

        public async Task<VehicleInsuranceDetails> GetVehicleInsuranceDetailByVehicleIdAndName(int vehicleId, string insuranceTypeName)
        {
            var vehicleInsuranceDetails = await this.vehicleRepository.GetVehicleInsuranceDetailByVehicleIdAndName(vehicleId, insuranceTypeName);
            return vehicleInsuranceDetails;
        }
    }
}
