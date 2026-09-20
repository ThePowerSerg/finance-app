using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;
using financeAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace financeAPI.Controllers
{
    // Expose this controller at /api/quotes with ASP.NET Core API conventions.
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        // Dependencies for outgoing HTTP calls and application configuration.
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        // ASP.NET Core supplies these dependencies through constructor injection.
        // Program.cs registers HttpClient; IConfiguration is provided by the host.
        public QuotesController(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        // GET /api/quotes?symbol=MSFT; an omitted symbol defaults to AAPL.
        // The cancellation token tracks cancellation of the incoming request.
        [HttpGet]
        public async Task<IActionResult> GetQuote([FromQuery] string symbol = "AAPL",
            CancellationToken cancellationToken = default)
        {
            // Accept one nonblank symbol; comma-separated batch requests are unsupported.
            if (string.IsNullOrWhiteSpace(symbol) || symbol.Contains(','))
                return BadRequest("Provide a single stock symbol.");

            // .NET maps the environment variable TwelveData__ApiKey to this key.
            // Stop before contacting the provider if configuration is missing.
            var apiKey = _configuration["TwelveData:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
                return Problem("Twelve Data API key is not configured.", statusCode: 500);

            // Trim and encode the symbol, and send the API key in the authorization header.
            // Dispose this request when the method exits, keeping the injected client separate.
            using var request = new HttpRequestMessage(HttpMethod.Get,
                $"https://api.twelvedata.com/quote?symbol={Uri.EscapeDataString(symbol.Trim())}");
            request.Headers.Authorization = new AuthenticationHeaderValue("apikey", apiKey);

            try
            {
                // Send the request asynchronously and map upstream HTTP failures to 502.
                // Dispose the response after reading it; propagate caller cancellation.
                using var response = await _httpClient.SendAsync(request, cancellationToken);
                if (!response.IsSuccessStatusCode)
                    return Problem("Twelve Data could not retrieve the quote.", statusCode: 502);

                // Deserialize into the provider-specific model, which accepts numeric strings.
                var result = await response.Content.ReadFromJsonAsync<TwelveDataQuoteResponse>(
                    cancellationToken: cancellationToken);

                // Twelve Data can return an error object even with HTTP 200.
                // Require a symbol and all four price fields before mapping the result.
                if (result is null || result.Status == "error" || string.IsNullOrWhiteSpace(result.Symbol)
                    || result.Open is null || result.High is null || result.Low is null || result.Close is null)
                    return Problem("Twelve Data returned an error or incomplete quote.", statusCode: 502);

                // Map the provider's fields to our model and return HTTP 200 without saving it.
                // Invalid dates become null; missing volume and price change default to zero.
                return Ok(new Quote
                {
                    Symbol = result.Symbol,
                    QuoteDate = DateTime.TryParse(result.Datetime, CultureInfo.InvariantCulture,
                        DateTimeStyles.None, out var quoteDate) ? quoteDate : null,
                    OpenPrice = result.Open.Value,
                    HighPrice = result.High.Value,
                    LowPrice = result.Low.Value,
                    ClosePrice = result.Close.Value,
                    Volume = result.Volume ?? 0,
                    // ReturnPrice represents the absolute change from the previous close.
                    ReturnPrice = result.Change ?? 0
                });
            }
            catch (HttpRequestException)
            {
                // Network or HTTP transport failures prevent retrieval of the quote.
                return Problem("Unable to reach Twelve Data.", statusCode: 502);
            }
            catch (JsonException)
            {
                // Malformed JSON or incompatible field values indicate an invalid response.
                return Problem("Twelve Data returned an invalid quote response.", statusCode: 502);
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                // Report upstream timeouts as 504; let caller cancellation propagate instead.
                return Problem("Twelve Data request timed out.", statusCode: 504);
            }
        }
    }
}
