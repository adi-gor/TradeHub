package com.example.stocktrading.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TradeRequest {

    @NotBlank(message = "Stock symbol is required")
    private String symbol;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    // Constructors
    public TradeRequest() {
    }

    public TradeRequest(String symbol, Integer quantity) {
        this.symbol = symbol;
        this.quantity = quantity;
    }

    // Getters
    public String getSymbol() {
        return symbol;
    }

    public Integer getQuantity() {
        return quantity;
    }

    // Setters
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}