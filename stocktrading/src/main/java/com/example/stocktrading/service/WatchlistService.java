package com.example.stocktrading.service;

import com.example.stocktrading.dto.StockQuoteResponse;
import com.example.stocktrading.dto.WatchlistResponse;
import com.example.stocktrading.entity.User;
import com.example.stocktrading.entity.Watchlist;
import com.example.stocktrading.repository.WatchlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FinnhubService finnhubService;

    /**
     * Add stock to watchlist
     */
    @Transactional
    public WatchlistResponse addToWatchlist(Long userId, String symbol) {
        // Validate stock symbol
        if (!finnhubService.isValidSymbol(symbol)) {
            throw new RuntimeException("Invalid stock symbol: " + symbol);
        }

        // Check if already exists
        if (watchlistRepository.existsByUserIdAndSymbol(userId, symbol.toUpperCase())) {
            throw new RuntimeException("Stock already in watchlist");
        }

        User user = userService.getUserById(userId);

        Watchlist watchlist = new Watchlist();
        watchlist.setUser(user);
        watchlist.setSymbol(symbol.toUpperCase());

        Watchlist saved = watchlistRepository.save(watchlist);

        return convertToResponse(saved);
    }

    /**
     * Remove stock from watchlist
     */
    @Transactional
    public void removeFromWatchlist(Long userId, String symbol) {
        if (!watchlistRepository.existsByUserIdAndSymbol(userId, symbol.toUpperCase())) {
            throw new RuntimeException("Stock not found in watchlist");
        }

        watchlistRepository.deleteByUserIdAndSymbol(userId, symbol.toUpperCase());
    }

    /**
     * Get user's watchlist with current prices
     */
    public List<WatchlistResponse> getUserWatchlist(Long userId) {
        List<Watchlist> watchlists = watchlistRepository.findByUserId(userId);
        List<WatchlistResponse> responses = new ArrayList<>();

        for (Watchlist watchlist : watchlists) {
            responses.add(convertToResponse(watchlist));
        }

        return responses;
    }

    /**
     * Check if stock is in user's watchlist
     */
    public boolean isInWatchlist(Long userId, String symbol) {
        return watchlistRepository.existsByUserIdAndSymbol(userId, symbol.toUpperCase());
    }

    /**
     * Clear entire watchlist
     */
    @Transactional
    public void clearWatchlist(Long userId) {
        List<Watchlist> watchlists = watchlistRepository.findByUserId(userId);
        watchlistRepository.deleteAll(watchlists);
    }

    /**
     * Convert Watchlist entity to WatchlistResponse with current price
     */
    private WatchlistResponse convertToResponse(Watchlist watchlist) {
        WatchlistResponse response = new WatchlistResponse();
        response.setId(watchlist.getId());
        response.setSymbol(watchlist.getSymbol());
        response.setAddedAt(watchlist.getAddedAt());

        try {
            // Get current stock quote
            StockQuoteResponse quote = finnhubService.getStockQuote(watchlist.getSymbol());
            response.setCurrentPrice(quote.getCurrentPrice());

            // Calculate change
            if (quote.getPreviousClose() != null &&
                    quote.getPreviousClose().compareTo(BigDecimal.ZERO) > 0) {

                BigDecimal change = quote.getCurrentPrice().subtract(quote.getPreviousClose());
                response.setChange(change);

                BigDecimal changePercent = change
                        .divide(quote.getPreviousClose(), 4, RoundingMode.HALF_UP)
                        .multiply(new BigDecimal("100"));
                response.setChangePercent(changePercent);
            }
        } catch (Exception e) {
            // If unable to fetch price, leave as null
            response.setCurrentPrice(null);
            response.setChange(null);
            response.setChangePercent(null);
        }

        return response;
    }
}