using System.Threading.Tasks;

namespace AspNetCore_SPA.Core
{
    public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}