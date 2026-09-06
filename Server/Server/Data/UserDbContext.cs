using Authentication.Entity;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data
{
    public class UserDbContext: DbContext
    {
        public UserDbContext(DbContextOptions options): base(options) { 
        }

        public DbSet<User> User { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .Property(x => x.Role)
                .HasConversion<string>();
        }
    }
}
