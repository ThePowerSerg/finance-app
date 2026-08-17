using financeAPI.Models;

namespace financeAPI.Services
{
    public interface IBookService
    {
        Task<IEnumerable<Book>> GetBooks();
        Task<Book> GetBookByID(int id);
        Task<Book> CreateBook(Book book);
        Task<Book> UpdateBook(Book book);
        void DeleteBook(int id);
    }
}