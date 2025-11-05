using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class UserDbContext(DbContextOptions<UserDbContext> options): DbContext(options) 
    {
        public DbSet<User> Users {  get; set; }
        public DbSet<Profile> Profiles { get; set; } 
        public DbSet<MileStone> MileStones { get; set; }
    }
}
