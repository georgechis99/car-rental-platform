using Shared.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Entities
{
    public class Discount
    {
        public int? Id { get; set; }
        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public DiscountType DiscountType { get; set; } 
        public Month Month { get; set; }
        public int IntervalStartInDays { get; set; }
        public int IntervalEndInDays { get; set; }
        public double DiscountPercentage { get; set; }
    }
}