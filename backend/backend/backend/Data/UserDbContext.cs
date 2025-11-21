using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class UserDbContext(DbContextOptions<UserDbContext> options): DbContext(options) 
    {
        public DbSet<User> Users {  get; set; }
        public DbSet<Profile> Profiles { get; set; } 
        public DbSet<MileStone> MileStones { get; set; }
        public DbSet<ListeningTest> ListeningTests { get; set; }
        public DbSet<ListeningSection> ListeningSections { get; set; }
        public DbSet<ListeningPart> ListeningParts { get; set; }
        public DbSet<ListeningQuestion> ListeningQuestions { get; set; }
        public DbSet<ListeningOption> ListeningOptionChoices { get; set; }
        public DbSet<ListeningAnswer> ListeningAnswers { get; set; }
        public DbSet<TestResult> UserTestResult { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ListeningTest>()
                .HasMany(t => t.Parts)
                .WithOne(p => p.ListeningTest)
                .HasForeignKey(p => p.TestId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
