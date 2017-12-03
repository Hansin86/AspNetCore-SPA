using System.Threading.Tasks;
using AspNetCore_SPA.Core;

namespace AspNetCore_SPA.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly MyDbContext context;

        public UnitOfWork(MyDbContext context)
        {
            this.context = context;
        }
        
        public async Task CompleteAsync()
        {
            await context.SaveChangesAsync();
        }
    }
}