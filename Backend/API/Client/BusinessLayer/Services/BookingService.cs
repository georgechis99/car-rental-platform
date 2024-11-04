using API.BusinessLayer.Interfaces;
using API.DataLayer.Helpers;
using AutoMapper;
using Microsoft.IdentityModel.Tokens;
using Shared.Dtos;
using Shared.Entities;
using Shared.RentDb.Interfaces;
using System.Net;

namespace API.BusinessLayer.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository bookingRepository;
        private readonly IMapper mapper;

        public BookingService(IBookingRepository bookingRepository,
            IMapper mapper)
        {
            this.bookingRepository = bookingRepository;
            this.mapper = mapper;
        }

        public async Task<IEnumerable<BookingToReturnDto>> GetBookingsAsync()
        {
            var bookings = await this.bookingRepository.GetBookingsAsync();
            return mapper.Map<IEnumerable<BookingToReturnDto>>(bookings);
        }

        public async Task<bool> IsVehicleAvailable(DateTime pickupDate, DateTime dropoffDate, int vehicleId)
        {
            return await this.bookingRepository.IsVehicleAvailable(pickupDate, dropoffDate, vehicleId);
        }

        public async Task<BookingToReturnDto> CreateBookingAndBillingAsync(BookingCreateModel model)
        {
            var bookingPickupDropoffLocationIds = await this.bookingRepository.GetBookingPickupDropoffLocationIds(model.VehicleId.Value, model.PickupLocationId.Value, model.DropoffLocationId.Value);

            var bookingToReturn = new BookingToReturnDto();

            try
            {
                var booking = new Booking
                {
                    UserEmail = model.UserEmail,
                    PickupDate = model.PickupDate.Value,
                    DropoffDate = model.DropoffDate.Value,
                    PickupLocationId = bookingPickupDropoffLocationIds.Item1,
                    DropoffLocationId = bookingPickupDropoffLocationIds.Item2,
                    IsGuest = model.IsGuest,
                    IsApproved = false,
                    VehicleInsuranceDetailId = model.VehicleInsuranceDetails.InsuranceType.Id,
                    PaymentMethod = model.PaymentMethod,
                    ChildSeatOption = model.ChildSeatOption,
                    MarketingCheckbox = model.MarketingCheckbox,
                    PromoCode = model.PromoCode,
                };

                var billing = new Billing
                {
                    Booking = booking,
                    UserEmail = model.UserEmail,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    PhoneNumber = model.PhoneNumber,
                    CompanyName = !model.CompanyName.IsNullOrEmpty() ? model.CompanyName : null,
                    CUI = !model.CUI.IsNullOrEmpty() ? model.CUI : null,
                };

                var bookingBillingTuple = await this.bookingRepository.CreateBookingAndBillingAsync(booking, billing);
                bookingToReturn = mapper.Map<BookingToReturnDto>(bookingBillingTuple.Item2);
                return bookingToReturn;
            }
            catch (Exception ex)
            {
                bookingToReturn.AddError(HttpStatusCode.InternalServerError, ex.Message,
                    ValidationMessagesConstants.CreateBookingFailedMsg);
            }

            return bookingToReturn;
        }
    }
}