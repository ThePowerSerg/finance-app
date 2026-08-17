using financeAPI.DTOs;

namespace financeAPI.Services
{
    public interface IBookService
    {
        Task<IEnumerable<BookDto>> GetBooks();
        Task<BookDto> GetBookByID(int id);
        Task<BookDto> CreateBook(BookDto book);
        Task<BookDto> UpdateBook(BookDto book);
        void DeleteBook(int id);
    }
}