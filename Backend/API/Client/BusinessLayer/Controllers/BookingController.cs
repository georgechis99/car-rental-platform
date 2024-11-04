using API.BusinessLayer.Helpers;
using API.BusinessLayer.Interfaces;
using API.BusinessLayer.Services;
using API.BusinessLayer.Services.Validation.Interfaces;
using API.DataLayer.Helpers;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using System.Net;

namespace API.BusinessLayer.Controllers
{
    public class BookingController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IBookingValidationService bookingValidationService;
        private readonly IBookingService bookingService;
        private readonly IVehicleService vehicleService;

        public BookingController(IBookingService bookingService,
            IBookingValidationService bookingValidationService,
            UserManager<AppUser> userManager,
            IVehicleService vehicleService)
        {
            this.bookingService = bookingService;
            this.bookingValidationService = bookingValidationService;
            this._userManager = userManager;
            this.vehicleService = vehicleService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookingToReturnDto>>> GetBookingsAsync()
        {
            var bookings = await bookingService.GetBookingsAsync();

            return Ok(bookings);
        }

        [HttpPost("guest")]
        public async Task<ActionResult<BookingToReturnDto>> CreateGuestBookingAsync([FromBody] BookingCreateModel model)
        {
            this.bookingValidationService.Validate(model);

            var vehicle = await vehicleService.GetVehicleByIdAsync(model.VehicleId.Value);
            if (vehicle == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.VehicleId), ValidationMessagesConstants.VehicleNotFoundValidationMsg);
            }

            var pickupLocation = await vehicleService.GetPickupDropoffLocationAsync(model.PickupLocationId.Value, model.VehicleId.Value, true);
            if (pickupLocation == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.PickupLocationId), ValidationMessagesConstants.PickupLocationNotFoundValidationMsg);
            }

            var dropoffLocation = await vehicleService.GetPickupDropoffLocationAsync(model.DropoffLocationId.Value, model.VehicleId.Value, false);
            if (dropoffLocation == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.DropoffLocationId), ValidationMessagesConstants.DropoffLocationNotFoundValidationMsg);
            }

            if (!await bookingService.IsVehicleAvailable(model.PickupDate.Value, model.DropoffDate.Value, model.VehicleId.Value))
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.VehicleId),
                string.Format(ValidationMessagesConstants.VehicleUnavailableForDatesMsg, model.VehicleId, model.PickupDate, model.DropoffDate));
            }

            if(model.VehicleInsuranceDetails == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.VehicleInsuranceDetails), ValidationMessagesConstants.VehicleInsuranceDetailsNullMsg);
            }

            if (model.IsValid)
            {
                var response = await this.bookingService.CreateBookingAndBillingAsync(model);

                if (!response.IsValid)
                {
                    return this.StatusCode(StatusCodes.Status500InternalServerError, response);
                }

                response.PickupLocation = pickupLocation.Location.Name + ", " + pickupLocation.Location.Address;
                response.DropoffLocation = dropoffLocation.Location.Name + ", " + pickupLocation.Location.Address;

                return this.Ok(response);
            }
            else
            {
                return this.StatusCode(StatusCodes.Status400BadRequest, new BookingToReturnDto() { Errors = model.Errors });
            }
        }

        [HttpPost("user")]
        public async Task<ActionResult<BookingToReturnDto>> CreateUserBookingAsync([FromBody] BookingCreateModel model)
        {
            this.bookingValidationService.Validate(model);

            var user = await _userManager.FindByEmailAsync(model.UserEmail);
            if (user == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.UserEmail), ValidationMessagesConstants.UserNotFoundValidationMsg);
            }

            var vehicle = await vehicleService.GetVehicleByIdAsync(model.VehicleId.Value);
            if (vehicle == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.VehicleId), ValidationMessagesConstants.VehicleNotFoundValidationMsg);
            }

            var pickupLocation = await vehicleService.GetPickupDropoffLocationAsync(model.PickupLocationId.Value, model.VehicleId.Value, true);
            if (pickupLocation == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.PickupLocationId), ValidationMessagesConstants.PickupLocationNotFoundValidationMsg);
            }

            var dropoffLocation = await vehicleService.GetPickupDropoffLocationAsync(model.DropoffLocationId.Value, model.VehicleId.Value, false);
            if (dropoffLocation == null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.DropoffLocationId), ValidationMessagesConstants.DropoffLocationNotFoundValidationMsg);
            }

            if (!await bookingService.IsVehicleAvailable(model.PickupDate.Value, model.DropoffDate.Value, model.VehicleId.Value))
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.VehicleId),
                    string.Format(ValidationMessagesConstants.VehicleUnavailableForDatesMsg, model.VehicleId, model.PickupDate, model.DropoffDate));
            }

            if (model.IsValid)
            {
                var response = await this.bookingService.CreateBookingAndBillingAsync(model);

                if (!response.IsValid)
                {
                    return this.StatusCode(StatusCodes.Status500InternalServerError, response);
                }

                response.PickupLocation = pickupLocation.Location.Name + ", " + pickupLocation.Location.Address;
                response.DropoffLocation = dropoffLocation.Location.Name + ", " + pickupLocation.Location.Address;

                return this.Ok(response);
            }
            else
            {
                return this.StatusCode(StatusCodes.Status400BadRequest, new BookingToReturnDto() { Errors = model.Errors });
            }
        }
    }
}
