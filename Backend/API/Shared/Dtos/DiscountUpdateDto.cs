using Shared.Entities;
using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class DiscountUpdateDto
    {
        public int VehicleId { get; set; }
        public DiscountType DiscountType { get; set; }
        public Month Month { get; set; }
        public int IntervalStartInDays { get; set; }
        public int IntervalEndInDays { get; set; }
        public int DiscountPercentage { get; set; }
    }
}
