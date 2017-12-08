using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using AspNetCore_SPA.Core;
using AspNetCore_SPA.Core.Models;
using AspNetCore_SPA.Extensions;
using Microsoft.EntityFrameworkCore;

namespace AspNetCore_SPA.Persistence
{
    public class VehicleRepository : IVehicleRepository
    {
        private readonly MyDbContext context;

        public VehicleRepository(MyDbContext context)
        {
            this.context = context;
        }
        public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
        {
            if(!includeRelated)
                return await context.Vehicles.FindAsync(id);
                
            return await context.Vehicles
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .SingleOrDefaultAsync(v => v.Id == id);
        }

        

        public void Add(Vehicle vehicle)
        {
            context.Vehicles.Add(vehicle);
        } 

        public void Remove(Vehicle vehicle)
        {
            context.Vehicles.Remove(vehicle);
        }

        public async Task<QueryResult<Vehicle>> GetVehicles(VehicleQuery queryObject)
        {                
            var result = new QueryResult<Vehicle>();

            var query = context.Vehicles
                .Include(v => v.Features)
                    .ThenInclude(vf => vf.Feature)
                .Include(v => v.Model)
                    .ThenInclude(m => m.Make)
                .AsQueryable();

            //filtering
            if(queryObject.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == queryObject.MakeId.Value);

            if(queryObject.ModelId.HasValue)
                query = query.Where(v => v.Model.Id == queryObject.ModelId.Value);

            //string str; we need to map string to expression
            //Expression<Func<Vehicle, object>> exp; for this mapping we are using a Dictionary
            var columnsMap = new Dictionary<string, Expression<Func<Vehicle, object>>>()
            {
                ["make"] = v => v.Model.Make.Name,
                ["model"] = v => v.Model.Name,
                ["contactName"] = v => v.ContactName
            };

            //sorting
            query = query.ApplyOrdering(queryObject, columnsMap);

            //ABOVE we refactored the code using dictionary
            // if(queryObject.SortBy == "make")
            //     query = (queryObject.isSortAscending) ? query.OrderBy(v => v.Model.Make.Name) : query.OrderByDescending(v => v.Model.Make.Name);
            // if(queryObject.SortBy == "model")
            //     query = (queryObject.isSortAscending) ? query.OrderBy(v => v.Model.Name) : query.OrderByDescending(v => v.Model.Name);
            // if(queryObject.SortBy == "contactName")
            //     query = (queryObject.isSortAscending) ? query.OrderBy(v => v.ContactName) : query.OrderByDescending(v => v.ContactName);
            // if(queryObject.SortBy == "id")
            //     query = (queryObject.isSortAscending) ? query.OrderBy(v => v.Id) : query.OrderByDescending(v => v.Id);                

            //total items used for paging
            result.TotalItems = await query.CountAsync();

            //paging
            query = query.ApplyPaging(queryObject);

            result.Items = await query.ToListAsync();
            return result;
        }        
    }
}