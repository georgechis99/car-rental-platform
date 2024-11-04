using AutoMapper;
using API.BusinessLayer.Helpers;
using Shared.Dtos;
using Shared.Entities;

namespace Helpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Vehicle, VehicleToReturnDto>()
            .ForMember(d => d.VehicleBrand, o => o.MapFrom(s => s.VehicleModel.VehicleBrand.Name))
            .ForMember(d => d.VehicleModel, o => o.MapFrom(s => s.VehicleModel.Name))
            .ForMember(d => d.PictureUrl, o => o.MapFrom<VehicleUrlResolver>())
            .ForMember(d => d.PickupLocationDeliveryFee, o => o.MapFrom(s => s.PickupDropoffLocations.FirstOrDefault(pdl => pdl.isPickup == true).DeliveryFee))
            .ForMember(d => d.DropoffLocationDeliveryFee, o => o.MapFrom(s => s.PickupDropoffLocations.FirstOrDefault(pdl => pdl.isPickup == false).DeliveryFee));

            //CreateMap<VehicleToReturnDto, Vehicle>()
            //.ForMember(d => d.VehicleModel.VehicleBrand.Name, o => o.MapFrom(s => s.VehicleBrand))
            //.ForMember(d => d.VehicleModel.Name, o => o.MapFrom(s => s.VehicleModel));

            CreateMap<VehicleInsuranceDetails, VehicleInsuranceDetailsDto>()
            .ForMember(dest => dest.VehicleId, opts => opts.MapFrom(src => src.VehicleId))
            .ForMember(dest => dest.InsuranceType, opts => opts.MapFrom(src => src.InsuranceType))
            .ForMember(dest => dest.InsurancePrice, opts => opts.MapFrom(src => src.InsurancePrice))
            .ForMember(dest => dest.DepositAmount, opts => opts.MapFrom(src => src.DepositAmount));

            CreateMap<VehicleInsuranceDetailsDto, VehicleInsuranceDetails>()
            .ForMember(dest => dest.VehicleId, opts => opts.MapFrom(src => src.VehicleId))
            .ForMember(dest => dest.InsuranceType, opts => opts.MapFrom(src => src.InsuranceType))
            .ForMember(dest => dest.InsurancePrice, opts => opts.MapFrom(src => src.InsurancePrice))
            .ForMember(dest => dest.DepositAmount, opts => opts.MapFrom(src => src.DepositAmount));


            CreateMap<Booking, BookingToReturnDto>()
                .ForMember(d => d.Vehicle, o => o.MapFrom(s => s.PickupLocation.Vehicle.VehicleModel.VehicleBrand.Name + " " + s.PickupLocation.Vehicle.VehicleModel.Name))
                .ForMember(d => d.PickupLocation, o => o.MapFrom(s => s.PickupLocation.Location.Name))
                .ForMember(d => d.DropoffLocation, o => o.MapFrom(s => s.DropoffLocation.Location.Name));

            CreateMap<VehicleUnavailability, VehicleUnavailabilityToReturnDto>()
                .ForMember(d => d.Vehicle, o => o.MapFrom(s => s.Vehicle.VehicleModel.VehicleBrand.Name + " " + s.Vehicle.VehicleModel.Name));

            CreateMap<Billing, BookingToReturnDto>()
            .ForMember(d => d.CreationDate, o => o.MapFrom(s => s.CreationDate))
            .ForMember(d => d.UserEmail, o => o.MapFrom(s => s.UserEmail))
            .ForMember(d => d.Vehicle, o => o.MapFrom(s => s.Booking.PickupLocation.Vehicle.VehicleModel.VehicleBrand.Name + " " + s.Booking.PickupLocation.Vehicle.VehicleModel.Name))
            .ForMember(d => d.PickupDate, o => o.MapFrom(s => s.Booking.PickupDate))
            .ForMember(d => d.DropoffDate, o => o.MapFrom(s => s.Booking.DropoffDate))
            .ForMember(d => d.PickupLocation, o => o.MapFrom(s => s.Booking.PickupLocation.Location.Name))
            .ForMember(d => d.DropoffLocation, o => o.MapFrom(s => s.Booking.DropoffLocation.Location.Name));

            CreateMap<Vehicle, VehicleDetailsDto>()
                .ForMember(d => d.VehicleBrand, o => o.MapFrom(s => s.VehicleModel.VehicleBrand.Name))
                .ForMember(d => d.VehicleModel, o => o.MapFrom(s => s.VehicleModel.Name));

            CreateMap<Discount, DiscountUpdateDto>();
        }
    }
}