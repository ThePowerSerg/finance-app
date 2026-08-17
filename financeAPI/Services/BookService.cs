using financeAPI.Models;

namespace financeAPI.Services
{
    public class BookService : IBookService
    {
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

        public Task<IEnumerable<Book>> GetBooks()
        {
            throw new NotImplementedException();
        }

        public Task<Book> UpdateBook(Book book)
        {
            throw new NotImplementedException();
        }
    }
}