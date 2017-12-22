using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore_SPA.Controllers.Resources;
using AspNetCore_SPA.Core;
using AspNetCore_SPA.Core.Models;
using AutoMapper;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace AspNetCore_SPA.Controllers
{
    // /api/vehicles/1/photos
    [Route("/api/vehicles/{vehicleId}/photos")]
    public class PhotosController : Controller
    {
        private readonly IHostingEnvironment host;
        private readonly IVehicleRepository repository;
        private readonly IPhotoRepository photoRepository;
        private readonly PhotoSettings photoSettings;
        private readonly IMapper mapper;
        private readonly IPhotoService photoService;

        public PhotosController(
            IHostingEnvironment host, 
            IVehicleRepository repository, 
            IPhotoRepository photoRepository,
            IMapper mapper, IOptionsSnapshot<PhotoSettings> options,
            IPhotoService photoService)
        {
            this.photoSettings = options.Value;
            this.mapper = mapper;
            this.photoService = photoService;
            this.repository = repository;
            this.photoRepository = photoRepository;
            this.host = host;
        }

        [HttpPost]
        public async Task<IActionResult> Upload(int vehicleId, IFormFile file) //when executing from angular, we must provide exatcly the same name for param "file"
        {
            var vehicle = await repository.GetVehicle(vehicleId, includeRelated: false);
            if (vehicle == null)
                return NotFound();

            if (file == null)
                return BadRequest("Null file");
            
            if (file.Length == 0)
                return BadRequest("Empty file");

            //Max 10MB files
            if (file.Length > photoSettings.MaxBytes)
                return BadRequest("Max file size exeeded");

            if (!photoSettings.IsSupported(file.FileName))
                return BadRequest("Invalid file type.");

            var uploadsFolderPath = Path.Combine(host.WebRootPath, "uploads"); //returns path on the hosting machine
            var photo = await photoService.UploadPhoto(vehicle, file, uploadsFolderPath);

            return Ok(mapper.Map<Photo, PhotoResource>(photo));
        }

        [HttpGet]
        public async Task<IEnumerable<PhotoResource>> GetPhotos(int vehicleId)
        {
            var photos = await photoRepository.GetPhotos(vehicleId);

            return mapper.Map<IEnumerable<Photo>, IEnumerable<PhotoResource>>(photos);
        }
    }
}