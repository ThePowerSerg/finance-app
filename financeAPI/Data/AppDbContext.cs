using financeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace financeAPI.Data
{
    public class AppDbContext(DbContextOptions options) : DbContext(options)
    {
        public DbSet<Book> Books { get; set; }
    }
}