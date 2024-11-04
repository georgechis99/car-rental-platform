using Shared.Entities;

namespace Shared.RentDb.Interfaces
{
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetBookingsAsync();

        Task<IEnumerable<Booking>> GetBookingsForVehicleInIntervalAsync(DateTime startDate, DateTime endDate, int vehicleId, string ownerEmail);

        Task<IEnumerable<Booking>> GetBookingsForVehicleAsync(int vehicleId);

        Task<IEnumerable<Booking>> GetBookingsForVehicleOnDateAsync(int vehicleId, DateTime date);

        Task<IEnumerable<VehicleUnavailability>> GetUnavailabilitiesForVehicleAsync(int vehicleId);

        Task<bool> IsVehicleAvailable(DateTime pickupDate, DateTime dropoffDate, int vehicleId);

        Task<Billing> CreateBillingAsync(Billing billing);

        Task<Booking> CreateBookingAsync(Booking booking);

        Task<Tuple<Booking, Billing>> CreateBookingAndBillingAsync(Booking booking, Billing billing);

        Task<Tuple<int, int>> GetBookingPickupDropoffLocationIds(int vehicleId, int pickupLocationId, int dropoffLocationId);
    }
}
