using Shared.Enums;

namespace Shared.Entities
{
    public class Booking : BaseEntity
    {
        public string UserEmail { get; set; }

        public DateTime PickupDate { get; set; }

        public DateTime DropoffDate { get; set; }

        public PickupDropoffLocation PickupLocation { get; set; }

        public int PickupLocationId { get; set; }   

        public PickupDropoffLocation DropoffLocation { get; set; }

        public int DropoffLocationId { get; set; }

        public bool IsGuest { get; set; }

        public bool IsApproved { get; set; }

        public int VehicleInsuranceDetailId { get; set; }

        public VehicleInsuranceDetails VehicleInsuranceDetail { get; set; }

        public bool ChildSeatOption { get; set; }

        public PaymentMethodEnum PaymentMethod { get; set; }

        public bool MarketingCheckbox { get; set; }

        public string PromoCode { get; set; }

    }
}