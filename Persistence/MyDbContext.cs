using AspNetCore_SPA.Models;
using Microsoft.EntityFrameworkCore;

namespace AspNetCore_SPA.Persistence
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) :base(options)
        {
            
        }

        public DbSet<Make> Makes  { get; set; }
        public DbSet<Feature> Features { get; set; }
    }
}