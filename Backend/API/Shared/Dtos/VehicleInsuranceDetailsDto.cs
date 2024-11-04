using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class VehicleInsuranceDetailsDto : BaseEntity
    {
        public int VehicleId { get; set; }
        public InsuranceType InsuranceType { get; set; }
        public decimal InsurancePrice { get; set; }
        public decimal DepositAmount { get; set; }

        public bool IsActive { get; set; }
    }
}
