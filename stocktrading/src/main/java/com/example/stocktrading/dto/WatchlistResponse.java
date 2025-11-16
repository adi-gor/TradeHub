package com.example.stocktrading.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WatchlistResponse {

    private Long id;
    private String symbol;
    private LocalDateTime addedAt;
    private BigDecimal currentPrice;
    private BigDecimal change;
    private BigDecimal changePercent;

    // Constructors
    public WatchlistResponse() {
    }

    public WatchlistResponse(Long id, String symbol, LocalDateTime addedAt,
                             BigDecimal currentPrice, BigDecimal change, BigDecimal changePercent) {
        this.id = id;
        this.symbol = symbol;
        this.addedAt = addedAt;
        this.currentPrice = currentPrice;
        this.change = change;
        this.changePercent = changePercent;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public BigDecimal getChange() {
        return change;
    }

    public BigDecimal getChangePercent() {
        return changePercent;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public void setChange(BigDecimal change) {
        this.change = change;
    }

    public void setChangePercent(BigDecimal changePercent) {
        this.changePercent = changePercent;
    }
}