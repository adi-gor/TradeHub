import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
  type User,
  type RegisterRequest,
  type LoginRequest,
  type TradeRequest,
  type StockQuote,
  type Portfolio,
  type Transaction,
  type PortfolioSummary,
  type ApiResponse,
  type WatchlistItem,
} from '../types';

// Base URL for your Spring Boot API
const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth credentials
api.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.username && user.password) {
        const credentials = btoa(`${user.username}:${user.password}`);
        config.headers.Authorization = `Basic ${credentials}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData: RegisterRequest): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.post('/auth/register', userData),
    
  login: (credentials: LoginRequest): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.post('/auth/login', credentials),
    
  getCurrentUser: (): Promise<AxiosResponse<User>> =>
    api.get('/auth/me'),
    
  addFunds: (amount: number): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.post(`/auth/add-funds?amount=${amount}`),
    
  withdrawFunds: (amount: number): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.post(`/auth/withdraw-funds?amount=${amount}`),
};

// Trading API
export const tradingAPI = {
  buyStock: (tradeData: TradeRequest): Promise<AxiosResponse<ApiResponse<Transaction>>> =>
    api.post('/trades/buy', tradeData),
    
  sellStock: (tradeData: TradeRequest): Promise<AxiosResponse<ApiResponse<Transaction>>> =>
    api.post('/trades/sell', tradeData),
};

// Portfolio API
export const portfolioAPI = {
  getPortfolio: (): Promise<AxiosResponse<Portfolio[]>> =>
    api.get('/portfolio'),
    
  getPortfolioSummary: (): Promise<AxiosResponse<PortfolioSummary>> =>
    api.get('/portfolio/summary'),
    
  getTransactions: (): Promise<AxiosResponse<Transaction[]>> =>
    api.get('/portfolio/transactions'),
    
  getTransactionsBySymbol: (symbol: string): Promise<AxiosResponse<Transaction[]>> =>
    api.get(`/portfolio/transactions/${symbol}`),
    
  getPortfolioValue: (): Promise<AxiosResponse<{ portfolioValue: number }>> =>
    api.get('/portfolio/value'),
    
  getProfitLoss: (): Promise<AxiosResponse<{ totalProfitLoss: number }>> =>
    api.get('/portfolio/profit-loss'),
};

// Stock API
export const stockAPI = {
  getQuote: (symbol: string): Promise<AxiosResponse<StockQuote>> =>
    api.get(`/stocks/quote/${symbol}`),
    
  getPrice: (symbol: string): Promise<AxiosResponse<{ symbol: string; currentPrice: number }>> =>
    api.get(`/stocks/price/${symbol}`),
    
  validateSymbol: (symbol: string): Promise<AxiosResponse<{ symbol: string; valid: boolean; currentPrice?: number }>> =>
    api.get(`/stocks/validate/${symbol}`),
    
  getMultipleQuotes: (symbols: string[]): Promise<AxiosResponse<Record<string, StockQuote>>> =>
    api.post('/stocks/quotes', { symbols }),
};

// Watchlist API
export const watchlistAPI = {
  getWatchlist: (): Promise<AxiosResponse<WatchlistItem[]>> =>
    api.get('/watchlist'),
    
  addToWatchlist: (symbol: string): Promise<AxiosResponse<{ message: string; watchlist: WatchlistItem }>> =>
    api.post('/watchlist', { symbol }),
    
  removeFromWatchlist: (symbol: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/watchlist/${symbol}`),
    
  checkWatchlist: (symbol: string): Promise<AxiosResponse<{ symbol: string; inWatchlist: boolean }>> =>
    api.get(`/watchlist/check/${symbol}`),
    
  clearWatchlist: (): Promise<AxiosResponse<{ message: string }>> =>
    api.delete('/watchlist'),
};

export default api;