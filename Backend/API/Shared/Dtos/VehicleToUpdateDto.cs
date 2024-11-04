using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class VehicleToUpdateDto
    {
        public int Id { get; set; }
        public string VehicleBrand { get; set; }
        public string VehicleModel { get; set; }
        public string ManufacturingDate { get; set; }
        public decimal Price { get; set; }
        public bool HasAirConditioning { get; set; }
        public string PictureUrl { get; set; }
        public string TransmissionType { get; set; }
        public int NumberOfDoors { get; set; }
        public int MaxNumberOfPassengers { get; set; }
        public int LuggageCapacity { get; set; }
        public string FuelType { get; set; }
        public decimal BaseDepositAmount { get; set; }
        public int BaseMaxDistance { get; set; }
        public decimal ReviewsScore { get; set; }
        public string VehicleRegistrationNumber { get; set; }
        public bool IsAvailable { get; set; }
    }
}
