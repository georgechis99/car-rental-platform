using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class BookingCreateModel : BaseResponse
    {
        public string UserEmail { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string CompanyName { get; set; }
        public string CUI { get; set; }
        public bool IsGuest { get; set; }

        public int? VehicleId { get; set; }

        public DateTime? PickupDate { get; set; }

        public DateTime? DropoffDate { get; set; }

        public int? PickupLocationId { get; set; }

        public int? DropoffLocationId { get; set; }

        public VehicleInsuranceDetailsDto VehicleInsuranceDetails { get; set; }

        public bool ChildSeatOption { get; set; }

        public PaymentMethodEnum PaymentMethod { get; set; }

        public bool MarketingCheckbox { get; set; }

        public string PromoCode { get; set; }

        [JsonIgnore]
        public override IList<Message> Errors { get; set; } = new List<Message>();
    }
}
