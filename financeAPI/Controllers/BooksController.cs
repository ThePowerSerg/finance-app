using financeAPI.DTOs;
using financeAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace financeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController(IBookService bookService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookDto>>> Get()
        {
            var books = await bookService.GetBooks();
            return Ok(books);
        }

        [HttpGet("{id}")]
        // Get request by Id 
        public async Task<ActionResult<BookDto>> GetById(int id)
        {
            var book = await bookService.GetBookByID(id);

            if (book == null) return NotFound();

            return Ok(book);
        }
    }
}