using financeAPI.Models;

namespace financeAPI.Services
{
    public interface IQuoteService
    {
        Task<Quote> GetQuoteAsync(string symbol);
    }
}