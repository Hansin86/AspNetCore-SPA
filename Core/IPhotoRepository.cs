using System.Collections.Generic;
using System.Threading.Tasks;
using AspNetCore_SPA.Core.Models;

namespace AspNetCore_SPA.Core
{
    public interface IPhotoRepository
    {
        Task<IEnumerable<Photo>> GetPhotos(int vehicleId);
    }
}