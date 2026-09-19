namespace financeAPI.Models
{
    public class Quote
    {
        public int Id { get; set; }
        public required string Symbol { get; set; }
        public DateTime? QuoteDate { get; set; }
        public decimal OpenPrice { get; set; }
        public decimal HighPrice { get; set; }
        public decimal LowPrice { get; set; }
        public decimal ClosePrice { get; set; }
        public decimal Volume  { get; set; }
        public decimal ReturnPrice { get; set; }
    }
}