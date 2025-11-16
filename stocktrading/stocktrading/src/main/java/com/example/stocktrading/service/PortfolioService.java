package com.example.stocktrading.service;

import com.example.stocktrading.dto.PortfolioResponse;
import com.example.stocktrading.dto.TransactionResponse;
import com.example.stocktrading.entity.Portfolio;
import com.example.stocktrading.entity.Transaction;
import com.example.stocktrading.repository.PortfolioRepository;
import com.example.stocktrading.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PortfolioService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private FinnhubService finnhubService;

    /**
     * Get user's portfolio with current prices
     */
    public List<PortfolioResponse> getUserPortfolio(Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        return portfolios.stream()
                .map(this::convertToPortfolioResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get user's transaction history
     */
    public List<TransactionResponse> getUserTransactions(Long userId) {
        List<Transaction> transactions = transactionRepository
                .findByUserIdOrderByTransactionDateDesc(userId);

        return transactions.stream()
                .map(this::convertToTransactionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get transactions for a specific stock symbol
     */
    public List<TransactionResponse> getTransactionsBySymbol(String symbol) {
        List<Transaction> transactions = transactionRepository.findBySymbol(symbol.toUpperCase());

        return transactions.stream()
                .map(this::convertToTransactionResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get portfolio value (total worth of all holdings)
     */
    public BigDecimal getPortfolioValue(Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        BigDecimal totalValue = BigDecimal.ZERO;

        for (Portfolio portfolio : portfolios) {
            try {
                BigDecimal currentPrice = finnhubService.getCurrentPrice(portfolio.getSymbol());
                BigDecimal holdingValue = currentPrice.multiply(new BigDecimal(portfolio.getQuantity()));
                totalValue = totalValue.add(holdingValue);
            } catch (Exception e) {
                // If unable to fetch price, use average price
                BigDecimal holdingValue = portfolio.getAveragePrice()
                        .multiply(new BigDecimal(portfolio.getQuantity()));
                totalValue = totalValue.add(holdingValue);
            }
        }

        return totalValue;
    }

    /**
     * Get total profit/loss across all holdings
     */
    public BigDecimal getTotalProfitLoss(Long userId) {
        List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

        BigDecimal totalProfitLoss = BigDecimal.ZERO;

        for (Portfolio portfolio : portfolios) {
            try {
                BigDecimal currentPrice = finnhubService.getCurrentPrice(portfolio.getSymbol());
                BigDecimal currentValue = currentPrice.multiply(new BigDecimal(portfolio.getQuantity()));
                BigDecimal costBasis = portfolio.getAveragePrice()
                        .multiply(new BigDecimal(portfolio.getQuantity()));
                BigDecimal profitLoss = currentValue.subtract(costBasis);
                totalProfitLoss = totalProfitLoss.add(profitLoss);
            } catch (Exception e) {
                // Skip if unable to fetch current price
            }
        }

        return totalProfitLoss;
    }

    /**
     * Convert Portfolio entity to PortfolioResponse DTO
     */
    private PortfolioResponse convertToPortfolioResponse(Portfolio portfolio) {
        PortfolioResponse response = new PortfolioResponse();
        response.setId(portfolio.getId());
        response.setSymbol(portfolio.getSymbol());
        response.setQuantity(portfolio.getQuantity());
        response.setAveragePrice(portfolio.getAveragePrice());

        try {
            // Get current price from Finnhub
            BigDecimal currentPrice = finnhubService.getCurrentPrice(portfolio.getSymbol());
            response.setCurrentPrice(currentPrice);

            // Calculate total value
            BigDecimal totalValue = currentPrice.multiply(new BigDecimal(portfolio.getQuantity()));
            response.setTotalValue(totalValue);

            // Calculate profit/loss
            BigDecimal costBasis = portfolio.getAveragePrice()
                    .multiply(new BigDecimal(portfolio.getQuantity()));
            BigDecimal profitLoss = totalValue.subtract(costBasis);
            response.setProfitLoss(profitLoss);

        } catch (Exception e) {
            // If unable to fetch current price, set it to average price
            response.setCurrentPrice(portfolio.getAveragePrice());
            BigDecimal totalValue = portfolio.getAveragePrice()
                    .multiply(new BigDecimal(portfolio.getQuantity()));
            response.setTotalValue(totalValue);
            response.setProfitLoss(BigDecimal.ZERO);
        }

        return response;
    }

    /**
     * Convert Transaction entity to TransactionResponse DTO
     */
    private TransactionResponse convertToTransactionResponse(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setSymbol(transaction.getSymbol());
        response.setType(transaction.getType().name());
        response.setQuantity(transaction.getQuantity());
        response.setPrice(transaction.getPrice());
        response.setTotalAmount(transaction.getTotalAmount());
        response.setTransactionDate(transaction.getTransactionDate());
        return response;
    }
}