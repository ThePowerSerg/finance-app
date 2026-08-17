using financeAPI.Data;
using Microsoft.EntityFrameworkCore;
using financeAPI.DTOs;
using financeAPI.Models;

namespace financeAPI.Services
{
    public class BookService(AppDbContext context) : IBookService
    {
        public async Task<IEnumerable<BookDto>> GetBooks()
        {
            return await context.Books
                .AsNoTracking()
                .Select(book => new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Description = book.Description
                })
                .ToListAsync();
        }

        public Task<BookDto> CreateBook(BookDto book)
        {
            throw new NotImplementedException();
        }

        public void DeleteBook(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<BookDto?> GetBookByID(int id)
        {
            return await context.Books
                .AsNoTracking()
                .Where(book => book.Id == id)
                .Select(book => new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Author = book.Author,
                    Description = book.Description
                })
                .SingleOrDefaultAsync();
        }

        public Task<BookDto> UpdateBook(BookDto book)
        {
            throw new NotImplementedException();
        }
    }
}
