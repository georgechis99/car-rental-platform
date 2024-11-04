using Admin.BusinessLayer.Services.Interfaces;
using AutoMapper;
using Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Shared.Dtos;
using Shared.RentDb.Interfaces;

namespace Admin.BusinessLayer.Services
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

        public async Task<IEnumerable<BookingToReturnDto>> GetBookingsForVehicleInIntervalAsync(DateTime startDate, DateTime endDate, int vehicleId, string ownerEmail)
        {
            var bookings = await this.bookingRepository.GetBookingsForVehicleInIntervalAsync(startDate, endDate, vehicleId, ownerEmail);
            return mapper.Map<IEnumerable<BookingToReturnDto>>(bookings);
        }
        public async Task<IEnumerable<BookingToReturnDto>> GetBookingsForVehicleAsync(int vehicleId)
        {
            var bookings = await this.bookingRepository.GetBookingsForVehicleAsync(vehicleId);
            return mapper.Map<IEnumerable<BookingToReturnDto>>(bookings);
        }
        
        public async Task<IEnumerable<VehicleUnavailabilityToReturnDto>> GetUnavailabilitiesForVehicleAsync(int vehicleId)
        {
            var unavailabilities = await this.bookingRepository.GetUnavailabilitiesForVehicleAsync(vehicleId);
            return mapper.Map<IEnumerable<VehicleUnavailabilityToReturnDto>>(unavailabilities);
        }
    }
}