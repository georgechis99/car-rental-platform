using Microsoft.EntityFrameworkCore;
using Shared.Entities;

namespace Shared.RentDb
{
    public class RentDbContext : DbContext
    {
        public RentDbContext(DbContextOptions<RentDbContext> options) : base(options)
        {
        }
        public DbSet<CategoryWithVehicle> CategoryWithVehicles { get; set; }
        public DbSet<VehicleBrand> VehicleBrands { get; set; }
        public DbSet<VehicleModel> VehicleModels { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<PickupDropoffLocation> PickupDropoffLocations { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Billing> Billings { get; set; }
        public DbSet<InsuranceType> InsuranceTypes { get; set; }
        public DbSet<VehicleInsuranceDetails> VehicleInsuranceDetails { get; set; }
        public DbSet<VehicleUnavailability> VehicleUnavailabilities { get; set; }
        public DbSet<Discount> Discounts { get; set; }
        public DbSet<PriceRange> PriceRanges { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
        }
    }
}
