# GetQuote implementation guide

The method is named `GetQuote` (singular) in `QuotesController.cs`. It handles `GET /api/quotes`, requests a single quote from Twelve Data, and returns the application's `Quote` model.

## Recent changes

The original implementation used a hardcoded AAPL URL containing the API key and deserialized the response directly into `Quote`. The current implementation:

- Accepts a symbol from the request query string, defaulting to `AAPL`.
- Reads the API key from configuration instead of source code.
- Sends authentication in the outgoing request's authorization header.
- Deserializes into a provider-specific response model before mapping to `Quote`.
- Handles upstream failures, invalid responses, timeouts, and request cancellation.
- Registers `HttpClient` in `Program.cs` so the controller can receive it through dependency injection.

## HttpClient and dependency injection

`Program.cs` registers HTTP client services:

```csharp
builder.Services.AddHttpClient();
```

The controller receives its dependencies through its constructor:

```csharp
private readonly HttpClient _httpClient;
private readonly IConfiguration _configuration;

public QuotesController(HttpClient httpClient, IConfiguration configuration)
{
    _httpClient = httpClient;
    _configuration = configuration;
}
```

ASP.NET Core creates the controller and supplies these dependencies. `HttpClient` sends the outgoing HTTP request to Twelve Data. The HTTP client factory infrastructure manages underlying handlers and connection reuse; the method does not create a new client for every request.

The method creates and disposes its own `HttpRequestMessage` and `HttpResponseMessage` with `using var`. These represent one exchange; the injected client remains separate.

## IConfiguration and the environment variable

`IConfiguration` provides access to application configuration. `WebApplication.CreateBuilder(args)` sets up the default configuration sources, including environment variables, and makes configuration available for injection. No separate `IConfiguration` registration is needed here.

The controller reads:

```csharp
var apiKey = _configuration["TwelveData:ApiKey"];
```

The environment variable is named `TwelveData__ApiKey`. .NET maps the double underscore to a colon:

```text
TwelveData__ApiKey → TwelveData:ApiKey → _configuration lookup
```

The lookup uses combined configuration, not exclusively environment variables. With the default configuration ordering, an environment variable overrides the same setting in `appsettings.json` or `appsettings.Development.json`.

If the value is missing, empty, or whitespace, the method returns HTTP 500 with the detail `Twelve Data API key is not configured.` before contacting Twelve Data.

Set the variable and start the API from the same terminal session. The folder where the variable is exported does not matter; the API process must inherit it. Bruno only calls the local API and does not need this variable.

See [Twelve Data API Key Setup](Twelve%20Data%20API%20Key%20Setup.md) for setup, persistence, verification, and troubleshooting instructions.

## Request flow

1. Bruno or the frontend sends `GET /api/quotes?symbol=MSFT`. Omitting `symbol` uses `AAPL`.
2. The method rejects whitespace-only symbols and comma-separated lists with HTTP 400. This is basic single-symbol validation, not a check that a ticker exists.
3. The controller reads the API key and verifies it is present.
4. The symbol is trimmed and URL-encoded before being placed in the Twelve Data URL.
5. `HttpClient` sends the request asynchronously with the cancellation token.
6. The response is checked, deserialized, and mapped to `Quote`.
7. `Ok(quote)` returns HTTP 200 with the mapped object.

The outgoing request is constructed as follows:

```csharp
using var request = new HttpRequestMessage(HttpMethod.Get,
    $"https://api.twelvedata.com/quote?symbol={Uri.EscapeDataString(symbol.Trim())}");
request.Headers.Authorization = new AuthenticationHeaderValue("apikey", apiKey);

using var response = await _httpClient.SendAsync(request, cancellationToken);
```

The header has the form `Authorization: apikey <API_KEY>`. The actual key is not included in the request URL or returned quote.

## Response model and mapping

`TwelveDataQuoteResponse` represents the external response separately from the application's `Quote` model. Its nullable properties allow the controller to detect missing data. The class-level attribute allows numeric strings such as `"148.44000"` to deserialize into decimal properties:

```csharp
[JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
```

The controller requires a symbol and non-null open, high, low, and close prices before returning a quote.

| Twelve Data field | Quote property | Handling |
| --- | --- | --- |
| `symbol` | `Symbol` | Required, nonblank |
| `datetime` | `QuoteDate` | Parsed with invariant culture; null if parsing fails |
| `open` | `OpenPrice` | Required |
| `high` | `HighPrice` | Required |
| `low` | `LowPrice` | Required |
| `close` | `ClosePrice` | Required |
| `volume` | `Volume` | Defaults to zero if absent or null |
| `change` | `ReturnPrice` | Absolute price change, not percentage return; defaults to zero |

The date parsing does not perform exchange-timezone conversion. The zero fallbacks for volume and change do not distinguish unavailable values from actual zero values. This method returns a quote without saving it to the database or assigning its `Id`.

## Error handling and cancellation

| Condition | Response |
| --- | --- |
| Blank symbol or comma-separated symbols | 400 Bad Request |
| API key missing from configuration | 500 Internal Server Error |
| Twelve Data returns a non-success HTTP status | 502 Bad Gateway |
| Null result, provider `status: "error"`, or missing required quote fields | 502 Bad Gateway |
| HTTP request fails with `HttpRequestException` | 502 Bad Gateway |
| Deserialization fails with `JsonException` | 502 Bad Gateway |
| Outgoing request is canceled without the incoming request being canceled, such as a timeout | 504 Gateway Timeout |

Provider error responses are mapped to generic local errors; the current method does not forward the provider's status code or error body. It also checks for a provider error object in an otherwise successful HTTP response.

ASP.NET Core binds the action's `CancellationToken` to the incoming request's cancellation. The method passes it to both `SendAsync` and `ReadFromJsonAsync`. If the caller disconnects or cancels, cancellation can stop the outgoing work. The catch filter avoids reporting that caller cancellation as an upstream timeout.

## Files involved

- [QuotesController.cs](../../financeAPI/Controllers/QuotesController.cs): validation, authentication, outgoing request, response mapping, and errors.
- [Program.cs](../../financeAPI/Program.cs): HTTP client registration and application startup.
- [TwelveDataQuoteResponse.cs](../../financeAPI/Models/TwelveDataQuoteResponse.cs): external response shape and numeric-string handling.
- [Quote.cs](../../financeAPI/Models/Quote.cs): application response model.

The controller currently calls `HttpClient` directly; `IQuoteService` is not used by this implementation.
