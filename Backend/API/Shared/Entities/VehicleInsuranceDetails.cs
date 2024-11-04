namespace Shared.Entities
{
    public class VehicleInsuranceDetails
    {
        public int? Id { get; set; }

        public Vehicle? Vehicle { get; set; }
        public int VehicleId { get; set; }

        public InsuranceType? InsuranceType { get; set; }
        public int InsuranceTypeId { get; set; }

        public decimal InsurancePrice { get; set; }

        public decimal DepositAmount { get; set; }

        public bool IsActive { get; set; }
    }
}
