import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const fetchStocks = async () => {
  const response = await axios.get(`${API_BASE_URL}/stocks`);
  return response.data.stocks;
};

export const fetchStockData = async (ticker: string, minutes: number) => {
  const response = await axios.get(
    `${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}`
  );
  return response.data;
};

export const fetchCorrelation = async (tickers: string[], minutes: number) => {
  console.log(tickers);
  console.log("TICKWES");
  const response = await axios.get(
    `${API_BASE_URL}/stockcorrelation?minutes=${minutes}&ticker=${tickers[0]}&ticker=${tickers[1]}`
  );
  console.log(response);
  return response.data;
};
