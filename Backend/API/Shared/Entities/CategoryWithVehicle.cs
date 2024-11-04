using System.ComponentModel.DataAnnotations.Schema;

namespace Shared.Entities
{
    public class CategoryWithVehicle : BaseEntity
    {
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; }
    }
}
