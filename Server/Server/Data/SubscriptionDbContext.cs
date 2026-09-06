using Microsoft.EntityFrameworkCore;
using Subscriptions.Entities;

namespace Subscriptions.Data
{
    public class SubscriptionDbContext : DbContext
    {
        public SubscriptionDbContext(DbContextOptions<SubscriptionDbContext> options) : base(options) { 
        
        }
        public DbSet<Subscription> Subscription { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Subscription>()
                .Property(x => x.BillingCycle)
                .HasConversion<string>();

            modelBuilder.Entity<Subscription>()
                .Property(x => x.Status)
                .HasConversion<string>();
        }
    } 
}
