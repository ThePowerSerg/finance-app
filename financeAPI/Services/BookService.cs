using financeAPI.Data;
using Microsoft.EntityFrameworkCore;
using financeAPI.DTOs;

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

        public Task<BookDto> GetBookByID(int id)
        {
            throw new NotImplementedException();
        }


        public Task<BookDto> UpdateBook(BookDto book)
        {
            throw new NotImplementedException();
        }
    }
}
