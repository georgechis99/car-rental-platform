using API.BusinessLayer.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Entities;
using Shared.Helpers;

namespace API.BusinessLayer.Controllers
{
    public class VehicleController : BaseApiController
    {
        private readonly IVehicleService vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            this.vehicleService = vehicleService;
        }

        [HttpPost]
        public async Task<ActionResult<Pagination<VehicleToReturnDto>>> GetVehiclesAsync([FromBody]VehicleSearchParams vehicleParams)
        {
            var result = await vehicleService.GetVehiclesAsync(vehicleParams);

            var totalItems = result.Item2;
            var vehicles = result.Item1;

            return Ok(new Pagination<VehicleToReturnDto>(vehicleParams.PageNumber, vehicleParams.PageSize, totalItems, vehicles));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleToReturnDto>> GetVehicleByIdAsync(int id)
        {
            var vehicle = await vehicleService.GetVehicleToReturnByIdAsync(id);
            vehicle.VehicleInsuranceDetails = await vehicleService.GetVehicleInsuranceDetailsAsync(id);
            return vehicle;
        }

        [HttpGet("discounted")]
        public async Task<ActionResult<VehicleToReturnDto>> GetDiscountedVehicleByIdAsync(int id, DateTime pickupDate, DateTime dropoffDate, int pickupLocationId, int dropoffLocationId)
        {
            var vehicle = await vehicleService.GetDiscountedVehicleToReturnByIdAsync(id,pickupDate,dropoffDate, pickupLocationId, dropoffLocationId);
            vehicle.VehicleInsuranceDetails = await vehicleService.GetVehicleInsuranceDetailsAsync(id);
            return vehicle;
        }

        [HttpGet("brands")]
        public async Task<ActionResult<IEnumerable<VehicleBrand>>> GetVehicleBrandsAsync()
        {
            var brands = await vehicleService.GetBrandsAsync();
            return Ok(brands);
        }

        [HttpGet("models")]
        public async Task<ActionResult<IEnumerable<VehicleModel>>> GetVehicleModelsAsync()
        {
            var models = await vehicleService.GetModelsAsync();
            return Ok(models);
        }

        [HttpGet("modelsByBrand/{brandId}")]
        public async Task<ActionResult<IEnumerable<VehicleModel>>> GetVehicleModelsByBrandIdAsync(int brandId)
        {
            var models = await vehicleService.GetModelsByBrandIdAsync(brandId);
            return Ok(models);
        }

        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<Category>>> GetVehicleCategoriesAsync()
        {
            var categories = await vehicleService.GetCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet("priceRanges")]
        public async Task<ActionResult<IEnumerable<PriceRange>>> GetVehiclePriceRangesAsync()
        {
            var categories = await vehicleService.GetVehiclePriceRangesAsync();
            return Ok(categories);
        }

        [HttpGet("locations")]
        public async Task<ActionResult<IEnumerable<Location>>> GetVehicleLocationsAsync()
        {
            var models = await vehicleService.GetLocationsAsync();
            return Ok(models);
        }

        [HttpGet("insuranceDetails/{vehicleId}")]
        public async Task<ActionResult<VehicleInsuranceDetails>> GetVehicleInsuranceDetailsAsync(int vehicleId)
        {
            var insuranceDetails = await vehicleService.GetVehicleInsuranceDetailsAsync(vehicleId);
            return Ok(insuranceDetails);
        }
    }
}