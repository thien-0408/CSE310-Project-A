using backend.Data;
using backend.Entities.User;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DataSeeder
    {
        public static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
        {
            // Use CreateScope 
            using (var scope = serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<UserDbContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<UserDbContext>>();

                // Ensure the database is created
                await context.Database.MigrateAsync();

                // Check if an Admin user already exists
                if (!await context.Users.AnyAsync(u => u.Role == "Admin"))
                {
                    logger.LogInformation("No Admin user found. Seeding new Admin...");

                    var adminUser = new User
                    {
                        Id = Guid.NewGuid(),
                        UserName = "admin", 
                        Role = "Admin" 
                    };
                    var adminProfile = new Profile 
                    {
                        Id = Guid.NewGuid(), 
                        UserId = adminUser.Id, 
                        User = adminUser,    

                        FullName = "Admin",
                        Email = "admin@example.com",
                        Bio = "Call me daddy",
                        TargetScore = 0.0f,
                        PhoneNumber = "0123456789",
                        DateOfBirth = new DateTime(1990, 1, 1),
                        AvatarUrl = string.Empty
                    };

                    var passwordHasher = new PasswordHasher<User>();
                    adminUser.PasswordHash = passwordHasher.HashPassword(adminUser, "Admin@123!"); 

                    await context.Profiles.AddAsync(adminProfile);
                    await context.Users.AddAsync(adminUser);
                    await context.SaveChangesAsync();

                    logger.LogInformation("Default Admin user created successfully.");
                }
                else
                {
                    logger.LogInformation("Admin user already exists. Seeding not required.");
                }
            }
        }
    }
}
