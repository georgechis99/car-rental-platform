using Shared.Dtos;

namespace Admin.BusinessLayer.Services.Interfaces
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingToReturnDto>> GetBookingsForVehicleInIntervalAsync(DateTime startDate, DateTime endDate, int vehicleId, string ownerEmail);
        Task<IEnumerable<BookingToReturnDto>> GetBookingsForVehicleAsync(int vehicleId);

        Task<IEnumerable<VehicleUnavailabilityToReturnDto>> GetUnavailabilitiesForVehicleAsync(int vehicleId);
    }
}
