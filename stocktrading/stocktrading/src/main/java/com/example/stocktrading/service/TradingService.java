package com.example.stocktrading.service;

import com.example.stocktrading.dto.TradeRequest;
import com.example.stocktrading.dto.TransactionResponse;
import com.example.stocktrading.entity.Portfolio;
import com.example.stocktrading.entity.Transaction;
import com.example.stocktrading.entity.TransactionType;
import com.example.stocktrading.entity.User;
import com.example.stocktrading.repository.PortfolioRepository;
import com.example.stocktrading.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.stocktrading.exception.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class TradingService {

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private FinnhubService finnhubService;

    /**
     * Buy stocks
     */
    @Transactional
    public TransactionResponse buyStock(Long userId, TradeRequest request) {
        // Validate stock symbol
        if (!finnhubService.isValidSymbol(request.getSymbol())) {
            throw new InvalidStockSymbolException("Invalid stock symbol: " + request.getSymbol());
        }

        // Get current stock price
        BigDecimal currentPrice = finnhubService.getCurrentPrice(request.getSymbol());

        // Calculate total cost
        BigDecimal totalCost = currentPrice.multiply(new BigDecimal(request.getQuantity()));

        // Get user
        User user = userService.getUserById(userId);

        // Check if user has sufficient balance
        if (user.getBalance().compareTo(totalCost) < 0) {
            throw new InsufficientBalanceException("Insufficient balance. Required: $" + totalCost +
                    ", Available: $" + user.getBalance());
        }

        // Deduct amount from user balance
        userService.updateBalance(userId, totalCost.negate());

        // Update or create portfolio entry
        Optional<Portfolio> existingPortfolio = portfolioRepository
                .findByUserIdAndSymbol(userId, request.getSymbol().toUpperCase());

        Portfolio portfolio;
        if (existingPortfolio.isPresent()) {
            portfolio = existingPortfolio.get();

            // Calculate new average price
            BigDecimal totalValue = portfolio.getAveragePrice()
                    .multiply(new BigDecimal(portfolio.getQuantity()))
                    .add(totalCost);

            int newQuantity = portfolio.getQuantity() + request.getQuantity();
            BigDecimal newAveragePrice = totalValue.divide(new BigDecimal(newQuantity), 2, RoundingMode.HALF_UP);

            portfolio.setQuantity(newQuantity);
            portfolio.setAveragePrice(newAveragePrice);
        } else {
            portfolio = new Portfolio();
            portfolio.setUser(user);
            portfolio.setSymbol(request.getSymbol().toUpperCase());
            portfolio.setQuantity(request.getQuantity());
            portfolio.setAveragePrice(currentPrice);
        }

        portfolioRepository.save(portfolio);

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setSymbol(request.getSymbol().toUpperCase());
        transaction.setType(TransactionType.BUY);
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(currentPrice);
        transaction.setTotalAmount(totalCost);

        Transaction savedTransaction = transactionRepository.save(transaction);

        return convertToTransactionResponse(savedTransaction);
    }

    /**
     * Sell stocks
     */
    @Transactional
    public TransactionResponse sellStock(Long userId, TradeRequest request) {
        // Validate stock symbol
        if (!finnhubService.isValidSymbol(request.getSymbol())) {
            throw new InvalidStockSymbolException("Invalid stock symbol: " + request.getSymbol());
        }

        // Get portfolio entry
        Portfolio portfolio = portfolioRepository
                .findByUserIdAndSymbol(userId, request.getSymbol().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("You don't own any shares of " + request.getSymbol()));

        // Check if user has enough shares
        if (portfolio.getQuantity() < request.getQuantity()) {
            throw new InsufficientSharesException("Insufficient shares. You have " + portfolio.getQuantity() +
                    " shares, trying to sell " + request.getQuantity());
        }

        // Get current stock price
        BigDecimal currentPrice = finnhubService.getCurrentPrice(request.getSymbol());

        // Calculate total sale amount
        BigDecimal totalAmount = currentPrice.multiply(new BigDecimal(request.getQuantity()));

        // Get user
        User user = userService.getUserById(userId);

        // Add amount to user balance
        userService.updateBalance(userId, totalAmount);

        // Update portfolio
        int newQuantity = portfolio.getQuantity() - request.getQuantity();
        if (newQuantity == 0) {
            // Remove portfolio entry if all shares are sold
            portfolioRepository.delete(portfolio);
        } else {
            portfolio.setQuantity(newQuantity);
            portfolioRepository.save(portfolio);
        }

        // Create transaction record
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setSymbol(request.getSymbol().toUpperCase());
        transaction.setType(TransactionType.SELL);
        transaction.setQuantity(request.getQuantity());
        transaction.setPrice(currentPrice);
        transaction.setTotalAmount(totalAmount);

        Transaction savedTransaction = transactionRepository.save(transaction);

        return convertToTransactionResponse(savedTransaction);
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