using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using AspNetCore_SPA.Core.Models;

namespace AspNetCore_SPA.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<Vehicle> ApplyFiltering(this IQueryable<Vehicle> query, VehicleQuery queryObject)
        {
            if(queryObject.MakeId.HasValue)
                query = query.Where(v => v.Model.MakeId == queryObject.MakeId.Value);

            if(queryObject.ModelId.HasValue)
                query = query.Where(v => v.Model.Id == queryObject.ModelId.Value);

            return query;
        }
        public static IQueryable<T> ApplyOrdering<T>(this IQueryable<T> query, IQueryObject queryObject, Dictionary<string, Expression<Func<T, object>>> columnsMap)
        {
            //be sure to include only existing column names 
            if(String.IsNullOrWhiteSpace(queryObject.SortBy) || !columnsMap.ContainsKey(queryObject.SortBy))
                return query;

            if(queryObject.isSortAscending)
                return query.OrderBy(columnsMap[queryObject.SortBy]);
            else
                return query.OrderByDescending(columnsMap[queryObject.SortBy]);
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, IQueryObject queryObject)
        {
            if(queryObject.PageSize <= 0)
                queryObject.PageSize = 10;

            if(queryObject.Page <= 0)
                queryObject.Page = 1;

            return query.Skip((queryObject.Page - 1) * queryObject.PageSize).Take(queryObject.PageSize);
        }
    }
}