package com.example.stocktrading.dto;

import jakarta.validation.constraints.NotBlank;

public class WatchlistRequest {

    @NotBlank(message = "Stock symbol is required")
    private String symbol;

    // Constructors
    public WatchlistRequest() {
    }

    public WatchlistRequest(String symbol) {
        this.symbol = symbol;
    }

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
}