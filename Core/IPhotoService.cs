using System.Threading.Tasks;
using AspNetCore_SPA.Core.Models;
using Microsoft.AspNetCore.Http;

namespace AspNetCore_SPA.Core
{
    public interface IPhotoService
    {
         Task<Photo> UploadPhoto(Vehicle vehicle, IFormFile file, string uploadsFolderPath);
    }
}