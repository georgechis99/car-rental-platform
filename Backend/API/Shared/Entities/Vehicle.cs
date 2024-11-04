using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities
{
    public class Vehicle : BaseEntity
    {
        public string OwnerId { get; set; }
        public VehicleModel VehicleModel { get; set; }

        public int VehicleModelId { get; set; }

        public List<PickupDropoffLocation> PickupDropoffLocations { get; set; }
        public List<CategoryWithVehicle> CategoryWithVehicles { get; set; }

        public DateTime ManufacturingDate { get; set; }

        public decimal Price { get; set; }

        public decimal BaseDepositAmount { get; set; }

        public decimal Extra100KmPrice { get; set; }

        public int BaseMaxDistance { get; set; }

        public decimal ReviewsScore { get; set; }

        public bool HasAirConditioning { get; set; }

        public string TransmissionType { get; set; }

        public int NumberOfDoors { get; set; }

        public int MaxNumberOfPassengers { get; set; }

        public int LuggageCapacity { get; set; }

        public string FuelType { get; set; }

        public string PictureUrl { get; set; }

        public string VehicleRegistrationNumber { get; set; }

        public bool IsAvailable { get; set; }

        public bool CanLeaveCountry { get; set; }
    }
}
