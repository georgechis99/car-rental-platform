using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Shared.Entities;
using Shared.Errors;
using Shared.RentDb;
using Shared.RentDb.Interfaces;

namespace Shared.RentDb.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly RentDbContext context;

        public BookingRepository(RentDbContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<Booking>> GetBookingsAsync()
        {
            return await context.Bookings
                .Include(b => b.PickupLocation.Vehicle).ThenInclude(v => v.VehicleModel.VehicleBrand)
                .Include(b => b.PickupLocation.Vehicle).ThenInclude(v => v.VehicleModel)
                .Include(b => b.PickupLocation)
                .Include(b => b.DropoffLocation)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsForVehicleInIntervalAsync(DateTime startDate, DateTime endDate, int vehicleId, string ownerEmail)
        {
            return await context.Bookings
                .Include(b => b.PickupLocation.Vehicle)
                .Include(b => b.DropoffLocation.Vehicle)
                .Where(b => b.PickupLocation.VehicleId == vehicleId && 
                        b.DropoffLocation.VehicleId == vehicleId &&
                        (b.DropoffDate >= startDate || b.PickupDate <= endDate))
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsForVehicleAsync(int vehicleId)
        {
            return await context.Bookings
                .Include(b => b.PickupLocation.Vehicle)
                .Include(b => b.DropoffLocation.Vehicle)
                .Include(b => b.PickupLocation.Location)
                .Include(b => b.DropoffLocation.Location)
                .Where(b => b.PickupLocation.VehicleId == vehicleId &&
                        b.DropoffLocation.VehicleId == vehicleId)
                .ToListAsync();
        }

        public async Task<IEnumerable<Booking>> GetBookingsForVehicleOnDateAsync(int vehicleId, DateTime date)
        {
            return await context.Bookings
                .Include(b => b.PickupLocation.Vehicle)
                .Include(b => b.DropoffLocation.Vehicle)
                .Include(b => b.PickupLocation.Location)
                .Include(b => b.DropoffLocation.Location)
                .Where(b => b.PickupLocation.VehicleId == vehicleId &&
                        b.DropoffLocation.VehicleId == vehicleId &&
                        (b.DropoffDate >= date || b.PickupDate <= date))
                .ToListAsync();
        }


        public async Task<IEnumerable<VehicleUnavailability>> GetUnavailabilitiesForVehicleAsync(int vehicleId)
        {
            return await context.VehicleUnavailabilities
                .Include(u => u.Vehicle)
                .Where(u => u.VehicleId == vehicleId)
                .ToListAsync();
        }

        public async Task<bool> IsVehicleAvailable(DateTime pickupDate, DateTime dropoffDate, int vehicleId)
        {
            var isBooked = await context.Bookings
                .Where(b => b.PickupLocation.VehicleId == vehicleId && b.DropoffLocation.VehicleId == vehicleId &&
                            //b.IsApproved == true &&
                            pickupDate <= b.DropoffDate && dropoffDate >= b.PickupDate)
                .AnyAsync();

            return !isBooked;
        }

        public async Task<Billing> CreateBillingAsync(Billing billing)
        {
            await context.Billings.AddAsync(billing);
            return billing;
        }

        public async Task<Booking> CreateBookingAsync(Booking booking)
        {
            await context.Bookings.AddAsync(booking);
            return booking;
        }

        public async Task<Tuple<Booking, Billing>> CreateBookingAndBillingAsync(Booking booking, Billing billing)
        {
            using (var transaction = context.Database.BeginTransaction())
            {
                try
                {
                    await CreateBookingAsync(booking);

                    billing.CreationDate = DateTime.Now;
                    await CreateBillingAsync(billing);
                    await context.SaveChangesAsync();
                    transaction.Commit();


                    return new Tuple<Booking, Billing>(booking, billing);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new CustomException(ex.Message, StatusCodes.Status500InternalServerError);
                }
            }
        }

        public async Task<Tuple<int, int>> GetBookingPickupDropoffLocationIds(int vehicleId, int pickupLocationId, int dropoffLocationId)
        {
            var bookingPickupLocationId = await context.PickupDropoffLocations.Where(pdl => pdl.LocationId == pickupLocationId &&
                                                                               pdl.isPickup == true &&
                                                                               pdl.VehicleId == vehicleId)
                                                                        .Select(pl => pl.Id)
                                                                        .FirstOrDefaultAsync();

            var bookingDropoffLocationId = await context.PickupDropoffLocations.Where(pdl => pdl.LocationId == dropoffLocationId &&
                                                                                pdl.isPickup == false &&
                                                                                pdl.VehicleId == vehicleId)
                                                                        .Select(dl => dl.Id)
                                                                        .FirstOrDefaultAsync();

            return new Tuple<int, int>(bookingPickupLocationId, bookingDropoffLocationId);
        }
    }
}
