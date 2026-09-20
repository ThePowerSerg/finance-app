using System.Text.Json.Serialization;

namespace financeAPI.Models
{
    // Provider-specific fields stay separate from the application's Quote model.
    // Twelve Data represents prices and volume as JSON strings.
    [JsonNumberHandling(JsonNumberHandling.AllowReadingFromString)]
    public sealed class TwelveDataQuoteResponse
    {
        public string? Status { get; set; }
        public string? Symbol { get; set; }
        public string? Datetime { get; set; }
        public decimal? Open { get; set; }
        public decimal? High { get; set; }
        public decimal? Low { get; set; }
        public decimal? Close { get; set; }
        public decimal? Volume { get; set; }
        public decimal? Change { get; set; }
    }
}
