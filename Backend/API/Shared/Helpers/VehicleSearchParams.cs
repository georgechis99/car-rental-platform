using Shared.Entities;

namespace Shared.Helpers
{
    public class VehicleSearchParams
    {
        private const int MaxPageSize = 20;

        public int PageNumber { get; set; } = 1;

        private int _pageSize = 6;
        public int PageSize
        {
            get { return _pageSize; }
            set { _pageSize = value > MaxPageSize ? MaxPageSize : value; }
        }

        public int? BrandId { get; set; }
        public int? ModelId { get; set; }

        public string Sort { get; set; }

        private string search;

        public string Search
        {
            get { return search; }
            set { search = value.ToLower(); }
        }

        public DateTime? PickupDate { get; set; }
        public DateTime? DropoffDate { get; set; }

        public int? PickupLocationId { get; set; }
        public int? DropoffLocationId { get; set; }

        public IEnumerable<PriceRange> PriceRanges { get; set; }

        public IEnumerable<Category> Categories { get; set; }

        public IEnumerable<string> TransmissionTypes { get; set; }
    }
}
