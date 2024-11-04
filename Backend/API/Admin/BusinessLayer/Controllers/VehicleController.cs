using Admin.BusinessLayer.Services.Interfaces;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Entities;
using Shared.Enums;
using Shared.Errors;
using Shared.Extensions;

namespace Admin.BusinessLayer.Controllers
{
    public class VehicleController : BaseAdminApiController
    {
        private readonly IVehicleService vehicleService;
        private readonly UserManager<AppUser> _userManager;


        public VehicleController(IVehicleService vehicleService,
            UserManager<AppUser> userManager)
        {
            this.vehicleService = vehicleService;
            _userManager = userManager;
        }

        [HttpGet("details/{ownerEmail}")]
        public async Task<ActionResult<IEnumerable<VehicleDetailsDto>>> GetVehiclesDetailsForOwnerIdAsync(string ownerEmail)
        {
            AppUser owner = await _userManager.FindByEmailAsync(ownerEmail);

            if (owner == null) return Unauthorized(new ApiResponse(401));

            var role = await _userManager.GetUserRole(owner);

            if (role != "Business") return Unauthorized(new ApiResponse(401));

            var vehicles = await vehicleService.GetVehiclesDetailsForOwnerIdAsync(owner.Id);

            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<VehicleToReturnDto>> GetVehicleByIdAsync(int id)
        {
            var vehicle = await vehicleService.GetVehicleToReturnByIdAsync(id);
            return vehicle;
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<VehicleToUpdateDto>> UpdateVehicle(int id, [FromBody] VehicleToUpdateDto updatedVehicle)
        {
            var existingEntity = await vehicleService.GetVehicleByIdAsync(id);

            if (existingEntity == null)
            {
                return NotFound();
            }

            existingEntity.IsAvailable = updatedVehicle.IsAvailable;
            existingEntity.VehicleRegistrationNumber = updatedVehicle.VehicleRegistrationNumber;

            var updatedEntity = await this.vehicleService.UpdateVehicleAsync(existingEntity);

            return Ok(updatedEntity);
        }

        [HttpGet("discounts/{id}/{type}")]
        public async Task<ActionResult<IEnumerable<Discount>>> GetDiscountsForVehicleAsync(int id, DiscountType type)
        {
            var discounts = await vehicleService.GetDiscountsForVehicleAsync(id, type);
            return Ok(discounts);
        }

        [HttpPost("discounts")]
        public async Task<ActionResult<DiscountsUpdateModel>> UpdateDiscounts([FromBody] DiscountsUpdateModel model)
        {
            var existingVehicle = await vehicleService.GetVehicleByIdAsync(model.VehicleId);

            if (existingVehicle == null)
            {
                return NotFound();
            }

            existingVehicle.CanLeaveCountry = model.CanLeaveCountry;
            existingVehicle.BaseDepositAmount = model.BaseDepositAmount;
            existingVehicle.Extra100KmPrice = model.Extra100KmPrice;
            existingVehicle.Price = model.Price;

            model.Vehicle = await this.vehicleService.UpdateVehicleAsync(existingVehicle);

            model.Discounts = (await this.vehicleService.UpdateDiscounts(model.Discounts, existingVehicle.Id)).ToList();

            return Ok(model);
        }

        [HttpGet("insuranceTypes")]
        public async Task<ActionResult<IEnumerable<InsuranceType>>> GetInsuranceTypesAsync()
        {
            var vehicleInsuranceTypes = await vehicleService.GetInsuranceTypesAsync();
            return Ok(vehicleInsuranceTypes);
        }

        [HttpGet("locations")]
        public async Task<ActionResult<IEnumerable<Location>>> GetVehicleLocationsAsync()
        {
            var models = await vehicleService.GetLocationsAsync();
            return Ok(models);
        }

        [HttpGet("locationNameById/{locationId}")]
        public async Task<ActionResult<LocationNameResponseDto>> GetLocationNameById(int locationId)
        {
            var locationName = await vehicleService.GetLocationNameById(locationId);
            var responseDto = new LocationNameResponseDto
            {
                LocationName = locationName
            };

            return Ok(responseDto);
        }


        [HttpGet("vehicleInsuranceDetails/{id}")]
        public async Task<ActionResult<IEnumerable<VehicleInsuranceDetailsDto>>> GetVehicleInsuranceDetailsAsync(int id)
        {
            var vehicleInsuranceDetails = await vehicleService.GetVehicleInsuranceDetailsAsync(id);
            return Ok(vehicleInsuranceDetails);
        }

        [HttpPost("vehicleInsuranceDetails")]
        public async Task<ActionResult<VehicleInsuranceDetailsUpdateModel>> UpdateVehicleInsuranceDetails([FromBody] VehicleInsuranceDetailsUpdateModel model)
        {
            var existingVehicle = await vehicleService.GetVehicleByIdAsync(model.VehicleId);

            if (existingVehicle == null)
            {
                return NotFound();
            }

            model.VehicleInsuranceDetails = (await this.vehicleService.UpdateVehicleInsuranceDetails(model.VehicleInsuranceDetails, existingVehicle.Id)).ToList();

            return Ok(model);
        }

        [HttpGet("pickupDropoffLocations/{ownerEmail}")]
        public async Task<ActionResult<IEnumerable<PickupDropoffLocation>>> GetPickupDropoffLocationsForOwnerEmail(string ownerEmail)
        {
            AppUser owner = await _userManager.FindByEmailAsync(ownerEmail);

            if (owner == null) return Unauthorized(new ApiResponse(401));

            var role = await _userManager.GetUserRole(owner);

            if (role != "Business") return Unauthorized(new ApiResponse(401));

            var pickupDropoffLocations = await vehicleService.GetPickupDropoffLocationsForOwnerId(owner.Id);

            return Ok(pickupDropoffLocations);
        }
    }
}