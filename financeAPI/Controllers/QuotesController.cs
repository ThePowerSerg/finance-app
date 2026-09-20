using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using financeAPI.Models;
using financeAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace financeAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public QuotesController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet()]
        public async Task<IActionResult> GetQuote()
        {
            string QUERY_URL = $"https://api.twelvedata.com/quote?symbol=AAPL&apikey=9b88c5eedb7f440b911855fa14635ebc";

            Uri queryUri = new Uri(QUERY_URL);
            var quote = await _httpClient.GetFromJsonAsync<Quote>(queryUri);

            if (quote == null)
            {
                return NotFound();
            }
            return Ok(quote);
        }
    }
}