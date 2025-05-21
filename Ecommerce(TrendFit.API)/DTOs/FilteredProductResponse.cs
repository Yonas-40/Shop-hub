namespace Ecommerce_TrendFit.API_.DTOs;

public class FilteredProductResponse
{
    public IEnumerable<ProductResponseDto> Products { get; set; }
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
}
