package com.example.stocktrading.controller;

import com.example.stocktrading.dto.StockQuoteResponse;
import com.example.stocktrading.service.FinnhubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private FinnhubService finnhubService;

    /**
     * Get stock quote (full details)
     */
    @GetMapping("/quote/{symbol}")
    public ResponseEntity<?> getStockQuote(@PathVariable String symbol) {
        try {
            StockQuoteResponse quote = finnhubService.getStockQuote(symbol.toUpperCase());

            Map<String, Object> response = new HashMap<>();
            response.put("symbol", symbol.toUpperCase());
            response.put("currentPrice", quote.getCurrentPrice());
            response.put("highPrice", quote.getHighPrice());
            response.put("lowPrice", quote.getLowPrice());
            response.put("openPrice", quote.getOpenPrice());
            response.put("previousClose", quote.getPreviousClose());
            response.put("timestamp", quote.getTimestamp());

            // Calculate change and change percentage
            if (quote.getPreviousClose() != null && quote.getPreviousClose().compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal change = quote.getCurrentPrice().subtract(quote.getPreviousClose());
                BigDecimal changePercent = change.divide(quote.getPreviousClose(), 4, BigDecimal.ROUND_HALF_UP)
                        .multiply(new BigDecimal("100"));

                response.put("change", change);
                response.put("changePercent", changePercent);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get current price only
     */
    @GetMapping("/price/{symbol}")
    public ResponseEntity<?> getCurrentPrice(@PathVariable String symbol) {
        try {
            BigDecimal price = finnhubService.getCurrentPrice(symbol.toUpperCase());

            Map<String, Object> response = new HashMap<>();
            response.put("symbol", symbol.toUpperCase());
            response.put("currentPrice", price);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Validate if a stock symbol exists
     */
    @GetMapping("/validate/{symbol}")
    public ResponseEntity<?> validateSymbol(@PathVariable String symbol) {
        try {
            boolean isValid = finnhubService.isValidSymbol(symbol.toUpperCase());

            Map<String, Object> response = new HashMap<>();
            response.put("symbol", symbol.toUpperCase());
            response.put("valid", isValid);

            if (isValid) {
                BigDecimal price = finnhubService.getCurrentPrice(symbol.toUpperCase());
                response.put("currentPrice", price);
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Search/Get multiple stock quotes
     */
    @PostMapping("/quotes")
    public ResponseEntity<?> getMultipleQuotes(@RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            java.util.List<String> symbols = (java.util.List<String>) request.get("symbols");

            if (symbols == null || symbols.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Symbols list is required");
                return ResponseEntity.badRequest().body(error);
            }

            Map<String, Object> quotes = new HashMap<>();

            for (String symbol : symbols) {
                try {
                    StockQuoteResponse quote = finnhubService.getStockQuote(symbol.toUpperCase());

                    Map<String, Object> quoteData = new HashMap<>();
                    quoteData.put("currentPrice", quote.getCurrentPrice());
                    quoteData.put("highPrice", quote.getHighPrice());
                    quoteData.put("lowPrice", quote.getLowPrice());
                    quoteData.put("openPrice", quote.getOpenPrice());
                    quoteData.put("previousClose", quote.getPreviousClose());

                    quotes.put(symbol.toUpperCase(), quoteData);
                } catch (Exception e) {
                    Map<String, String> errorData = new HashMap<>();
                    errorData.put("error", e.getMessage());
                    quotes.put(symbol.toUpperCase(), errorData);
                }
            }

            return ResponseEntity.ok(quotes);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}