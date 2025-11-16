package com.example.stocktrading.controller;

import com.example.stocktrading.dto.TradeRequest;
import com.example.stocktrading.dto.TransactionResponse;
import com.example.stocktrading.entity.User;
import com.example.stocktrading.service.TradingService;
import com.example.stocktrading.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/trades")
public class TradingController {

    @Autowired
    private TradingService tradingService;

    @Autowired
    private UserService userService;

    /**
     * Buy stocks
     */
    @PostMapping("/buy")
    public ResponseEntity<?> buyStock(@Valid @RequestBody TradeRequest request) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            // Execute buy transaction
            TransactionResponse transaction = tradingService.buyStock(user.getId(), request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Stock purchased successfully");
            response.put("transaction", transaction);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    /**
     * Sell stocks
     */
    @PostMapping("/sell")
    public ResponseEntity<?> sellStock(@Valid @RequestBody TradeRequest request) {
        try {
            // Get current authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            // Execute sell transaction
            TransactionResponse transaction = tradingService.sellStock(user.getId(), request);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Stock sold successfully");
            response.put("transaction", transaction);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }
}