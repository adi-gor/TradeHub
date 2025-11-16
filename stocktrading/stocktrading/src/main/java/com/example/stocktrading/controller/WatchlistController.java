package com.example.stocktrading.controller;

import com.example.stocktrading.dto.WatchlistRequest;
import com.example.stocktrading.dto.WatchlistResponse;
import com.example.stocktrading.entity.User;
import com.example.stocktrading.service.UserService;
import com.example.stocktrading.service.WatchlistService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private UserService userService;

    /**
     * Get user's watchlist
     */
    @GetMapping
    public ResponseEntity<?> getWatchlist() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            List<WatchlistResponse> watchlist = watchlistService.getUserWatchlist(user.getId());

            return ResponseEntity.ok(watchlist);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Add stock to watchlist
     */
    @PostMapping
    public ResponseEntity<?> addToWatchlist(@Valid @RequestBody WatchlistRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            WatchlistResponse watchlistItem = watchlistService.addToWatchlist(
                    user.getId(),
                    request.getSymbol()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Stock added to watchlist");
            response.put("watchlist", watchlistItem);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Remove stock from watchlist
     */
    @DeleteMapping("/{symbol}")
    public ResponseEntity<?> removeFromWatchlist(@PathVariable String symbol) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            watchlistService.removeFromWatchlist(user.getId(), symbol);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Stock removed from watchlist");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Check if stock is in watchlist
     */
    @GetMapping("/check/{symbol}")
    public ResponseEntity<?> checkWatchlist(@PathVariable String symbol) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            boolean inWatchlist = watchlistService.isInWatchlist(user.getId(), symbol);

            Map<String, Object> response = new HashMap<>();
            response.put("symbol", symbol.toUpperCase());
            response.put("inWatchlist", inWatchlist);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Clear entire watchlist
     */
    @DeleteMapping
    public ResponseEntity<?> clearWatchlist() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            watchlistService.clearWatchlist(user.getId());

            Map<String, String> response = new HashMap<>();
            response.put("message", "Watchlist cleared successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}