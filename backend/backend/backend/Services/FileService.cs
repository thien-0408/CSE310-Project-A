namespace backend.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        public FileService(IWebHostEnvironment environment)
        {
            _environment = environment;
        }
        public void DeleteFile(string? path)
        {
            if (string.IsNullOrEmpty(path))
            {
                return;
            }


            var wwwRootPath = _environment.WebRootPath; //wwwroot

            var pathToRemove = path.TrimStart('/'); //D/avaa/sadsd.img
            var filePath = Path.Combine(wwwRootPath, pathToRemove);

            if (File.Exists(filePath))
            {
                try
                {
                    File.Delete(filePath);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error deleting file {filePath}: {ex.Message}");
                }
            }
        }
        public async Task<string> UploadFile(IFormFile file, string folder)
        {
            if (file is null || file.Length == 0)
            {
                throw new ArgumentException("You selected an empty file!");
            }

            var wwwrootPath = _environment.WebRootPath;
            var uploadPath = Path.Combine(wwwrootPath, folder);

           
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }
           
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/{folder.Replace("\\", "/")}/{fileName}";
        }
    }
}

