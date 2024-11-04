using Shared.Dtos;

namespace API.BusinessLayer.Services.Validation.Interfaces
{
    public interface IBookingValidationService
    {
        void Validate(BookingCreateModel model);

        void ValidateRequired(BookingCreateModel model);

        void ValidateDates(BookingCreateModel model);
    }
}
