namespace backend.Services
{
    public interface  IFileService
    {
        Task<string> UploadFile(IFormFile file, string folder);
        void DeleteFile(string? path);
    }
}
