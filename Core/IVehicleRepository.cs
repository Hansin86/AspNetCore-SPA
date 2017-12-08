using System.Collections.Generic;
using System.Threading.Tasks;
using AspNetCore_SPA.Core.Models;

namespace AspNetCore_SPA.Core
{
    public interface IVehicleRepository
    {
         Task<Vehicle> GetVehicle(int id, bool includeRelated = true);
         Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery filter);
         void Add(Vehicle vehicle);
         void Remove(Vehicle vehicle);
    }
}