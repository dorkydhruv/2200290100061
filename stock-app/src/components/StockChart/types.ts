export interface StockData {
  price: number;
  lastUpdatedAt: string;
}

export interface StockResponse {
  averageStockPrice: number;
  priceHistory: StockData[];
}