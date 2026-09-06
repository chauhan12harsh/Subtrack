using Microsoft.EntityFrameworkCore;
using Payments.Entity;

namespace Payments.Data
{
    public class PaymentDbContext : DbContext
    {
        public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options) { }

        public DbSet<Payment> Payment { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<Payment>()
                .Property(x => x.Status)
                .HasConversion<string>();
        }
    }
}
