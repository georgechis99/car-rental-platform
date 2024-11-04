using Shared.Dtos;

namespace API.BusinessLayer.Interfaces
{
    public interface IBookingService
    {
        Task<IEnumerable<BookingToReturnDto>> GetBookingsAsync();

        Task<bool> IsVehicleAvailable(DateTime pickupDate, DateTime dropoffDate, int vehicleId);

        Task<BookingToReturnDto> CreateBookingAndBillingAsync(BookingCreateModel model);
    }
}
