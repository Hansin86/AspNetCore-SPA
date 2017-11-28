using AspNetCore_SPA.Controllers.Resources;
using AspNetCore_SPA.Models;
using AutoMapper;

namespace AspNetCore_SPA.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Make, MakeResource>();
            CreateMap<Model, ModelResource>();
            CreateMap<Feature, FeatureResource>();
        }
    }
}