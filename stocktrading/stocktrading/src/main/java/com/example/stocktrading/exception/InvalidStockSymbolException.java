package com.example.stocktrading.exception;

public class InvalidStockSymbolException extends RuntimeException {

    public InvalidStockSymbolException(String message) {
        super(message);
    }

    public InvalidStockSymbolException(String message, Throwable cause) {
        super(message, cause);
    }
}