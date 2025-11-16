package com.example.stocktrading.service;

import com.example.stocktrading.dto.StockQuoteResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import java.math.BigDecimal;

@Service
public class FinnhubService {

    @Value("${finnhub.api.key}")
    private String apiKey;

    @Value("${finnhub.api.base-url}")
    private String baseUrl;

    private final RestTemplate restTemplate;

    public FinnhubService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Get current stock quote from Finnhub
     */
    public StockQuoteResponse getStockQuote(String symbol) {
        try {
            String url = String.format("%s/quote?symbol=%s&token=%s",
                    baseUrl, symbol.toUpperCase(), apiKey);

            StockQuoteResponse response = restTemplate.getForObject(url, StockQuoteResponse.class);

            if (response == null || response.getCurrentPrice() == null ||
                    response.getCurrentPrice().compareTo(BigDecimal.ZERO) == 0) {
                throw new RuntimeException("Invalid stock symbol or no data available");
            }

            return response;
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Error fetching stock data: " + e.getMessage());
        }
    }

    /**
     * Get current price for a stock symbol
     */
    public BigDecimal getCurrentPrice(String symbol) {
        StockQuoteResponse quote = getStockQuote(symbol);
        return quote.getCurrentPrice();
    }

    /**
     * Validate if stock symbol exists
     */
    public boolean isValidSymbol(String symbol) {
        try {
            StockQuoteResponse quote = getStockQuote(symbol);
            return quote.getCurrentPrice() != null &&
                    quote.getCurrentPrice().compareTo(BigDecimal.ZERO) > 0;
        } catch (Exception e) {
            return false;
        }
    }
}