using Shared.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Dtos
{
    public class DiscountsUpdateModel
    {
        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }
        public bool CanLeaveCountry { get; set; }
        public decimal BaseDepositAmount { get; set; }
        public decimal Price { get; set; }
        public decimal Extra100KmPrice { get; set; }
        public List<Discount> Discounts { get; set; }
    }
}
