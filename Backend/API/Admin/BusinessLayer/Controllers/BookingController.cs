using Admin.BusinessLayer.Services.Interfaces;
using API.DataLayer.Helpers;
using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.Errors;
using System.Net;
using System.Text.Json;

namespace Admin.BusinessLayer.Controllers
{
    public class BookingController : BaseAdminApiController
    {
        private readonly IBookingService bookingService;
        private readonly IVehicleService vehicleService;
        private readonly UserManager<AppUser> _userManager;


        public BookingController(IBookingService bookingService, IVehicleService vehicleService,
            UserManager<AppUser> userManager)
        {
            this.bookingService = bookingService;
            this.vehicleService = vehicleService;
            _userManager = userManager;
        }

        [HttpGet("bookingsForVehicleInInterval")]
        public async Task<ActionResult<IEnumerable<BookingToReturnDto>>> GetBookingsForVehicleInIntervalAsync([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] int vehicleId, [FromQuery] string ownerEmail)
        {
            var vehicle = await vehicleService.GetVehicleByIdAsync(vehicleId);
            if (vehicle == null)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Vehicle not found." } });
            }

            var bookings = await bookingService.GetBookingsForVehicleInIntervalAsync(startDate, endDate, vehicleId, ownerEmail);

            return Ok(bookings);
        }

        [HttpGet("bookings")]
        public async Task<ActionResult<IEnumerable<BookingToReturnDto>>> GetBookingsForVehicleAsync([FromQuery] int vehicleId)
        {
            var vehicle = await vehicleService.GetVehicleByIdAsync(vehicleId);
            if (vehicle == null)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Vehicle not found." } });
            }

            var bookings = await bookingService.GetBookingsForVehicleAsync(vehicleId);
            foreach (var booking in bookings)
            {
                var user = await _userManager.FindByEmailAsync(booking.UserEmail);
                booking.PhoneNumber = user?.PhoneNumber ?? "-";
                booking.UserFullName = $"{user?.FirstName ?? "-"} {user?.LastName ?? "-"}";
            }

            return Ok(bookings);
        }

        [HttpGet("unavailableDates")]
        public async Task<ActionResult<IEnumerable<BookingToReturnDto>>> GetUnavailableDatesForVehicleAsync([FromQuery] int vehicleId)
        {
            var vehicle = await vehicleService.GetVehicleByIdAsync(vehicleId);
            if (vehicle == null)
            {
                return new BadRequestObjectResult(new ApiValidationErrorResponse { Errors = new[] { "Vehicle not found." } });
            }

            var unavailableDates = await bookingService.GetUnavailabilitiesForVehicleAsync(vehicleId);

            return Ok(unavailableDates);
        }
    }
}
