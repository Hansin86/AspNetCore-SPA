using Microsoft.EntityFrameworkCore;

namespace AspNetCore_SPA.Persistence
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) :base(options)
        {
            
        }
    }
}