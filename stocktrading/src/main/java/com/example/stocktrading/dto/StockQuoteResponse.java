package com.example.stocktrading.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class StockQuoteResponse {

    @JsonProperty("c")
    private BigDecimal currentPrice;

    @JsonProperty("h")
    private BigDecimal highPrice;

    @JsonProperty("l")
    private BigDecimal lowPrice;

    @JsonProperty("o")
    private BigDecimal openPrice;

    @JsonProperty("pc")
    private BigDecimal previousClose;

    @JsonProperty("t")
    private Long timestamp;

    // Constructors
    public StockQuoteResponse() {
    }

    public StockQuoteResponse(BigDecimal currentPrice, BigDecimal highPrice,
                              BigDecimal lowPrice, BigDecimal openPrice,
                              BigDecimal previousClose, Long timestamp) {
        this.currentPrice = currentPrice;
        this.highPrice = highPrice;
        this.lowPrice = lowPrice;
        this.openPrice = openPrice;
        this.previousClose = previousClose;
        this.timestamp = timestamp;
    }

    // Getters
    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public BigDecimal getHighPrice() {
        return highPrice;
    }

    public BigDecimal getLowPrice() {
        return lowPrice;
    }

    public BigDecimal getOpenPrice() {
        return openPrice;
    }

    public BigDecimal getPreviousClose() {
        return previousClose;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    // Setters
    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public void setHighPrice(BigDecimal highPrice) {
        this.highPrice = highPrice;
    }

    public void setLowPrice(BigDecimal lowPrice) {
        this.lowPrice = lowPrice;
    }

    public void setOpenPrice(BigDecimal openPrice) {
        this.openPrice = openPrice;
    }

    public void setPreviousClose(BigDecimal previousClose) {
        this.previousClose = previousClose;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}