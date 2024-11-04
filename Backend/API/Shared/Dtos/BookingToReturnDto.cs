using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class BookingToReturnDto : BaseResponse
    {
        public DateTime? CreationDate { get; set; }
        public string UserEmail { get; set; }
        public string PhoneNumber { get; set; }
        public string UserFullName { get; set; }

        public string Vehicle { get; set; }

        public DateTime PickupDate { get; set; }

        public DateTime DropoffDate { get; set; }

        public string PickupLocation { get; set; }

        public string DropoffLocation { get; set; }

        public bool IsGuest { get; set; }
        public bool IsApproved { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public override IList<Message> Errors { get; set; } = new List<Message>();
    }
}
