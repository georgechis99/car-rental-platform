using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class VehicleDetailsDto
    {
        public int Id { get; set; }
        public string VehicleRegistrationNumber { get; set; }
        public string VehicleBrand { get; set; }
        public string VehicleModel { get; set; }
    }
}
