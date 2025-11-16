package com.example.stocktrading.controller;

import com.example.stocktrading.dto.PortfolioResponse;
import com.example.stocktrading.dto.TransactionResponse;
import com.example.stocktrading.dto.UserResponse;
import com.example.stocktrading.entity.User;
import com.example.stocktrading.service.PortfolioService;
import com.example.stocktrading.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserService userService;

    /**
     * Get user's portfolio (all holdings)
     */
    @GetMapping
    public ResponseEntity<?> getPortfolio() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            List<PortfolioResponse> portfolio = portfolioService.getUserPortfolio(user.getId());

            return ResponseEntity.ok(portfolio);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get portfolio summary (total value, profit/loss)
     */
    @GetMapping("/summary")
    public ResponseEntity<?> getPortfolioSummary() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            List<PortfolioResponse> portfolio = portfolioService.getUserPortfolio(user.getId());
            BigDecimal portfolioValue = portfolioService.getPortfolioValue(user.getId());
            BigDecimal totalProfitLoss = portfolioService.getTotalProfitLoss(user.getId());
            UserResponse userResponse = userService.getUserResponseByUsername(username);

            Map<String, Object> summary = new HashMap<>();
            summary.put("user", userResponse);
            summary.put("cashBalance", userResponse.getBalance());
            summary.put("portfolioValue", portfolioValue);
            summary.put("totalValue", userResponse.getBalance().add(portfolioValue));
            summary.put("totalProfitLoss", totalProfitLoss);
            summary.put("holdings", portfolio);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get user's transaction history
     */
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            List<TransactionResponse> transactions = portfolioService.getUserTransactions(user.getId());

            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get transactions for a specific stock symbol
     */
    @GetMapping("/transactions/{symbol}")
    public ResponseEntity<?> getTransactionsBySymbol(@PathVariable String symbol) {
        try {
            List<TransactionResponse> transactions = portfolioService.getTransactionsBySymbol(symbol);

            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get portfolio value
     */
    @GetMapping("/value")
    public ResponseEntity<?> getPortfolioValue() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            BigDecimal portfolioValue = portfolioService.getPortfolioValue(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("portfolioValue", portfolioValue);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * Get total profit/loss
     */
    @GetMapping("/profit-loss")
    public ResponseEntity<?> getProfitLoss() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            User user = userService.getUserByUsername(username);

            BigDecimal profitLoss = portfolioService.getTotalProfitLoss(user.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("totalProfitLoss", profitLoss);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}