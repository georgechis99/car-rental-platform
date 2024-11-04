using API.BusinessLayer.Services.Validation.Interfaces;
using API.DataLayer.Helpers;
using Entities;
using Microsoft.AspNetCore.Identity;
using Shared.Dtos;
using Shared.Entities;
using System.Net;

namespace API.BusinessLayer.Services.Validation
{
    public class BookingValidationService : IBookingValidationService
    {

        public void Validate(BookingCreateModel model)
        {
            model.Errors.Clear();
            this.ValidateRequired(model);
            this.ValidateDates(model);
        }

        public void ValidateDates(BookingCreateModel model)
        {
            if (model.PickupDate.Value.Date < DateTime.Now.Date)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.PickupDate), 
                    ValidationMessagesConstants.PickupDateInThePastValidationMsg);
            }

            if (model.DropoffDate.Value.Date < model.PickupDate.Value.Date.AddDays(1))
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.DropoffDate), 
                    ValidationMessagesConstants.DropoffDateSmallerThanPickupDatePlusOneMsg);
            }
        }

        public void ValidateRequired(BookingCreateModel model)
        {
            if(model is null)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.UserEmail), ValidationMessagesConstants.CreateBookingNullModelMsg);
            }

            if (string.IsNullOrEmpty(model.UserEmail))
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.UserEmail), ValidationMessagesConstants.MissingFieldValidationMsg);
            }

            if (!model.VehicleId.HasValue)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.VehicleId), ValidationMessagesConstants.MissingFieldValidationMsg);
            }

            if (!model.PickupDate.HasValue)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.PickupDate), ValidationMessagesConstants.MissingFieldValidationMsg);
            }

            if (!model.DropoffDate.HasValue)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.DropoffDate), ValidationMessagesConstants.MissingFieldValidationMsg);
            }

            if (!model.PickupLocationId.HasValue)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.PickupLocationId), ValidationMessagesConstants.MissingFieldValidationMsg);
            }

            if (!model.DropoffLocationId.HasValue)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.DropoffLocationId), ValidationMessagesConstants.MissingFieldValidationMsg);
            }

            if(!model.VehicleInsuranceDetails.InsuranceType.Name.Contains("Insurance"))
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.VehicleInsuranceDetails), ValidationMessagesConstants.MissingFieldValidationMsg);
            }

            if(model.PaymentMethod != Shared.Enums.PaymentMethodEnum.Cash && model.PaymentMethod != Shared.Enums.PaymentMethodEnum.Card)
            {
                model.AddError(HttpStatusCode.BadRequest, nameof(model.PaymentMethod), ValidationMessagesConstants.MissingFieldValidationMsg);
            }
        }
    }
}
