global using Apex.Models.Entities;

namespace Apex.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Company> Companies => Set<Company>();
        public DbSet<Contract> Contracts => Set<Contract>();
        public DbSet<Post> Posts => Set<Post>();
        public DbSet<Employee> Employees => Set<Employee>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Company>()
                .HasOne(c => c.Admin)
                .WithOne(a => a.Company)
                .IsRequired()
                .OnDelete(DeleteBehavior.NoAction);
        }

    }
}