using Shared.Entities;

namespace Shared.Dtos
{
    public class VehicleToReturnDto
    {
        public int Id { get; set; }

        public string VehicleBrand { get; set; }

        public string VehicleModel { get; set; }

        public DateTime ManufacturingDate { get; set; }

        public decimal Price { get; set; }

        public decimal DiscountedPrice { get; set; }

        public double DiscountPercentage { get; set; }

        public decimal TotalPriceWithoutDiscounts { get; set; }

        public decimal TotalPrice { get; set; }

        public decimal BaseDepositAmount { get; set; }

        public decimal ReviewsScore { get; set; }

        public bool HasAirConditioning { get; set; }

        public string PictureUrl { get; set; }

        public string TransmissionType { get; set; }

        public int NumberOfDoors { get; set; }

        public int MaxNumberOfPassengers { get; set; }

        public int LuggageCapacity { get; set; }

        public string FuelType { get; set; }

        public int BaseMaxDistance { get; set; }

        public string VehicleRegistrationNumber { get; set; }

        public IEnumerable<VehicleInsuranceDetailsDto> VehicleInsuranceDetails { get; set; }

        public bool IsAvailable { get; set; }

        public decimal Extra100KmPrice { get; set; }

        public bool CanLeaveCountry { get; set; }

        public decimal PickupLocationDeliveryFee { get; set; }

        public decimal DropoffLocationDeliveryFee { get; set; }
    }
}
