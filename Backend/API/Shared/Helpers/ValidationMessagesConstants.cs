using System.Net.NetworkInformation;

namespace API.DataLayer.Helpers
{
    public static class ValidationMessagesConstants
    {
        public static readonly string MissingFieldValidationMsg = "Please provide the required information";

        public static readonly string UserNotFoundValidationMsg = "User not found.";

        public static readonly string VehicleNotFoundValidationMsg = "Vehicle not found.";

        public static readonly string PickupLocationNotFoundValidationMsg = "Pickup location not found.";

        public static readonly string DropoffLocationNotFoundValidationMsg = "Dropoff location not found.";

        public static readonly string PickupDateInThePastValidationMsg = "Pickup date cannot be in the past.";

        public static readonly string DropoffDateSmallerThanPickupDatePlusOneMsg = "Dropoff date must be on or after pickup date plus one day.";
        
        public static readonly string VehicleUnavailableForDatesMsg = "Vehicle with id:{0} is booked/not available in the {1}-{2} interval.";

        public static readonly string CreateBookingFailedMsg = "Booking failed to be added to the database.";

        public static readonly string CreateBookingNullModelMsg = "The CreateBookingModel is null.";

        public static readonly string VehicleInsuranceDetailsNullMsg = "Vehicle Insurance Details in the parameter list is empty.";
    }
}
