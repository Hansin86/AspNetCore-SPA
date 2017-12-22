using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace AspNetCore_SPA.Core
{
    public class FileSystemPhotoStorage : IPhotoStorage
    {
        public async Task<string> StorePhoto(string uploadsFolderPath, IFormFile file)
        {
            if (!Directory.Exists(uploadsFolderPath))
                Directory.CreateDirectory(uploadsFolderPath);

            //always generate new file name, in case someone changes file name in request to: ../../../windows/system/asd.dll
            //simplest solution is GUID
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            //read input file and store it
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return fileName;
        }
    }
}