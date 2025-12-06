using backend.Entities;
using backend.Entities.Listening;
using backend.Entities.Notification;
using backend.Entities.Reading;
using backend.Entities.User;
using backend.Entities.Writing;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class UserDbContext(DbContextOptions<UserDbContext> options): DbContext(options) 
    {
        //User
        public DbSet<User> Users {  get; set; }
        public DbSet<Profile> Profiles { get; set; } 
        public DbSet<MileStone> MileStones { get; set; }
        //--------------------------------------------------------------------------
        //Listening
        public DbSet<ListeningTest> ListeningTests { get; set; }
        public DbSet<ListeningTestResult> ListeningTestResults { get; set; }
        public DbSet<ListeningPart> ListeningParts { get; set; }
        public DbSet<ListeningSection> ListeningSections { get; set; }
        public DbSet<ListeningQuestion> ListeningQuestions { get; set; }
        public DbSet<ListeningOption> ListeningOptions { get; set; }
        public DbSet<ListeningAnswer> ListeningAnswers { get; set; }
        
        //--------------------------------------------------------------------------
        //Reading
        public DbSet<ReadingTest> ReadingTests { get; set; }
        public DbSet<ReadingSection> ReadingSections { get; set; }
        public DbSet<ReadingPart> ReadingParts { get; set; }
        public DbSet<ReadingQuestion> ReadingQuestions { get; set; }
        public DbSet<SectionOption> SectionOptions { get; set; }
        public DbSet<QuestionOption> QuestionOptions { get; set; }
        public DbSet<ReadingTestResult> ReadingTestResults { get; set; }

        //--------------------------------------------------------------------------
        //Writing
        public DbSet<WritingTest> WritingTests { get; set; }
        public DbSet<WritingSubmission> WritingSubmissions { get; set; }
        public DbSet<WritingResult> WritingResults { get; set; }

        //--------------------------------------------------------------------------
        //Notifications
        public DbSet<DailyTip> DailyTips { get; set; } 
        public DbSet<DailyWord> DailyWords { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ListeningPart>()
              .HasOne(p => p.ListeningTest)
              .WithMany(t => t.Parts)
              .HasForeignKey(p => p.ListeningTestId)
              .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ListeningSection>()
                .HasOne(s => s.ListeningPart)
                .WithMany(p => p.Sections)
                .HasForeignKey(s => s.ListeningPartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReadingPart>()
                .HasMany(p => p.Sections)
                .WithOne(s => s.Part)
                .HasForeignKey(s => s.PartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ReadingSection>()
                .HasMany(s => s.Questions)
                .WithOne(q => q.Section)
                .HasForeignKey(q => q.SectionId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WritingSubmission>()
                .HasOne(s => s.Result) 
                .WithOne(r => r.Submission) 
                .HasForeignKey<WritingResult>(r => r.SubmissionId) 
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<DailyTip>().HasKey(x => x.Id);
            modelBuilder.Entity<DailyWord>().HasKey(x => x.Id);
        }
    }
}
