using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class VehicleInsuranceDetailsUpdateModel
    {
        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public List<VehicleInsuranceDetails> VehicleInsuranceDetails { get; set; }

    }
}
