using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities
{
    public class PickupDropoffLocation : BaseEntity
    {
        public Location Location { get; set; }

        public int LocationId { get; set; }

        public Vehicle Vehicle { get; set; }

        public int VehicleId { get; set; }

        public bool isPickup { get; set; }

        public decimal? DeliveryFee { get; set; }
    }
}
