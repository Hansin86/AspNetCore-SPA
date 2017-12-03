using AspNetCore_SPA.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AspNetCore_SPA.Persistence
{
    public class MyDbContext : DbContext
    {
        public DbSet<Make> Makes  { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Model> Models { get; set; }

        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options)
        {
            
        }        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VehicleFeature>().HasKey(vf => 
                new { vf.VehicleId, vf.FeatureId});
        }
    }
}