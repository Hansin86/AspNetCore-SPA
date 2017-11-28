using System.Collections.Generic;
using System.Threading.Tasks;
using AspNetCore_SPA.Controllers.Resources;
using AspNetCore_SPA.Models;
using AspNetCore_SPA.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AspNetCore_SPA.Controllers
{
    public class MakesController : Controller
    {
        private readonly MyDbContext context;
        private readonly IMapper mapper;

        public MakesController(MyDbContext context, IMapper mapper)
        {
            this.mapper = mapper;
            this.context = context;
        }

        [HttpGet("/api/makes")]
        public async Task<IEnumerable<MakeResource>> GetMakes()
        {
            var makes = await context.Makes.Include(m => m.Models).ToListAsync();

            return mapper.Map<List<Make>, List<MakeResource>>(makes);
        }
    }
}