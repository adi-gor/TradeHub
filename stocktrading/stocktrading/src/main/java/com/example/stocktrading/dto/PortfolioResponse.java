package com.example.stocktrading.dto;

import java.math.BigDecimal;

public class PortfolioResponse {

    private Long id;
    private String symbol;
    private Integer quantity;
    private BigDecimal averagePrice;
    private BigDecimal currentPrice;
    private BigDecimal totalValue;
    private BigDecimal profitLoss;

    // Constructors
    public PortfolioResponse() {
    }

    public PortfolioResponse(Long id, String symbol, Integer quantity, BigDecimal averagePrice,
                             BigDecimal currentPrice, BigDecimal totalValue, BigDecimal profitLoss) {
        this.id = id;
        this.symbol = symbol;
        this.quantity = quantity;
        this.averagePrice = averagePrice;
        this.currentPrice = currentPrice;
        this.totalValue = totalValue;
        this.profitLoss = profitLoss;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public BigDecimal getTotalValue() {
        return totalValue;
    }

    public BigDecimal getProfitLoss() {
        return profitLoss;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public void setTotalValue(BigDecimal totalValue) {
        this.totalValue = totalValue;
    }

    public void setProfitLoss(BigDecimal profitLoss) {
        this.profitLoss = profitLoss;
    }
}