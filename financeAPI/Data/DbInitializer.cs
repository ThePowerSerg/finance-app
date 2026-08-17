using financeAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace financeAPI.Data
{
    public class DbInitializer
    {
        // Add Books
        public static void SeedData(DbContext context, bool seed)
        {
            var appDbContext = (AppDbContext)context;

            if (!appDbContext.Books.Any())
            {
                var books = new List<Book>()
                {
                    new()
                    {
                        Title="A Random Walk Down Wall Street",
                        Author="Burton G. Malkiel"
                    },
                    new()
                    {
                        Title="Commodities for dummies",
                        Author="Amine Bouchentouf"
                    }
                };
                appDbContext.AddRange(books);
            }
            appDbContext.SaveChanges();
        }
    }
}