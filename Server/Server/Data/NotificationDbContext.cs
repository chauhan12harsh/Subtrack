using Microsoft.EntityFrameworkCore;
using Notifications.Entity;

namespace Notifications.Data
{
    public class NotificationDbContext : DbContext
    {
        public NotificationDbContext(DbContextOptions<NotificationDbContext> options) : base(options)
        {

        }

        public DbSet<Notification> Notification { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Notification>()
                .Property(x => x.Type)
                .HasConversion<string>();
        }

    }
}
