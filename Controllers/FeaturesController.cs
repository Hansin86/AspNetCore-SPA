using System.Collections.Generic;
using System.Threading.Tasks;
using AspNetCore_SPA.Controllers.Resources;
using AspNetCore_SPA.Core.Models;
using AspNetCore_SPA.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCore_SPA.Controllers
{
    public class FeaturesController : Controller
    {
        private readonly MyDbContext context;
        private readonly IMapper mapper;

        public FeaturesController(MyDbContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet("/api/features")]
        public async Task<List<KeyValuePairResource>> GetFeatures()
        {
            var features = await context.Features.ToListAsync();

            return mapper.Map<List<Feature>, List<KeyValuePairResource>>(features);
        }
    }
}