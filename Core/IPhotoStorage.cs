using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace AspNetCore_SPA.Core
{
    public interface IPhotoStorage
    {        
         Task<string> StorePhoto(string uploadsFolderPath, IFormFile file);
    }
}