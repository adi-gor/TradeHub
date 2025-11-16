export interface User {
    id: number;
    username: string;
    email: string;
    balance: number;
    password?: string; // For storing Basic Auth credentials
  }
  
  export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface TradeRequest {
    symbol: string;
    quantity: number;
  }
  
  export interface StockQuote {
    symbol: string;
    currentPrice: number;
    highPrice: number;
    lowPrice: number;
    openPrice: number;
    previousClose: number;
    timestamp: number;
    change?: number;
    changePercent?: number;
  }
  
  export interface Portfolio {
    id: number;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    totalValue: number;
    profitLoss: number;
  }
  
  export interface Transaction {
    id: number;
    symbol: string;
    type: string;
    quantity: number;
    price: number;
    totalAmount: number;
    transactionDate: string;
  }
  
  export interface PortfolioSummary {
    user: User;
    cashBalance: number;
    portfolioValue: number;
    totalValue: number;
    totalProfitLoss: number;
    holdings: Portfolio[];
  }
  
  export interface WatchlistItem {
  id: number;
  symbol: string;
  addedAt: string;
  currentPrice: number | null;
  change: number | null;
  changePercent: number | null;
}

export interface WatchlistRequest {
  symbol: string;
}

  export interface ApiResponse<T> {
    data: T;
    message?: string;
  }
  
  export interface ApiError {
    error: string;
    message?: string;
  }