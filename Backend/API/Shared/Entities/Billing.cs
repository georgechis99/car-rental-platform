namespace Shared.Entities
{
    public class Billing : BaseEntity
    {
        public Booking Booking { get; set; }
        public DateTime? CreationDate { get; set; }
        public string UserEmail { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string CompanyName { get; set; }
        public string CUI { get; set; }
    }
}
