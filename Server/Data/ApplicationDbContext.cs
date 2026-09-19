using Microsoft.EntityFrameworkCore;

// Entities [Db Tables]
using SubTrack.Authentication.Entities;
using SubTrack.Notifications.Entities;
using SubTrack.Payments.Entities;
using SubTrack.Subscriptions.Entities;

namespace SubTrack.Data
{
    public class ApplicationDbContext: DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { 
        
        }

        public DbSet<User> User { get; set; }
        public DbSet<Subscription> Subscription { get; set; }
        public DbSet<Payment> Payment { get; set; }
        public DbSet<Notification> Notification { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
             .Property(x => x.Role)
             .HasConversion<string>();

            modelBuilder.Entity<Subscription>()
             .Property(x => x.Status)
             .HasConversion<string>();

            modelBuilder.Entity<Subscription>()
             .Property(x => x.BillingCycle)
             .HasConversion<string>();

            modelBuilder.Entity<Payment>()
                .Property(x => x.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Notification>()
                .Property(x => x.Type)
                .HasConversion<string>();

        }
    }
}
