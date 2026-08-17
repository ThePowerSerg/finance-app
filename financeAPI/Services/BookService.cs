using financeAPI.Models;
using financeAPI.Data;
using Microsoft.EntityFrameworkCore;
using financeAPI.DTOs;

namespace financeAPI.Services
{
    public class BookService(AppDbContext context) : IBookService
    {
        public async Task<IEnumerable<BookDto>> GetBooks()
        {
            var books = await context.Books.ToListAsync();
            var booksDto = new BookDto()
            {
                Id = books.First(x => x.Id )
                Title = 
            };
            return booksDto;
        }

        public Task<Book> CreateBook(Book book)
        {
            throw new NotImplementedException();
        }

        public void DeleteBook(int id)
        {
            throw new NotImplementedException();
        }

        public Task<Book> GetBookByID(int id)
        {
            throw new NotImplementedException();
        }


        public Task<Book> UpdateBook(Book book)
        {
            throw new NotImplementedException();
        }
    }
}