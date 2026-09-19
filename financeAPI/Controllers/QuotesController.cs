using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using financeAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace financeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly IQuoteService _quoteService;
        private readonly HttpClient _httpClient;

        public QuotesController(IQuoteService quoteService, HttpClient httpClient)
        {
            _quoteService = quoteService;
            _httpClient = httpClient;
        }

        [HttpGet("{symbol}")]
        public async Task<IActionResult> GetQuote(string symbol)
        {
            var quote = await _quoteService.GetQuoteAsync(symbol);
            if (quote == null)
            {
                return NotFound();
            }
            return Ok(quote);
        }
    }
}