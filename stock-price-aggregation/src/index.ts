import express from "express";
import dotenv from "dotenv";
import NodeCache from "node-cache";
import axios from "axios";
import { BASE_URL } from "./const";
import { StockPrice } from "./types";
import cors from "cors";
dotenv.config();
const app = express();
const AUTH_TOKEN = process.env.AUTH_TOKEN;
app.use(express.json());
app.use(cors());

// Expiration set to 60 seconds
const cache = new NodeCache({ stdTTL: 60 });

app.get("/stocks", async (_req, res) => {
  try {
    const cached = cache.get("stocks");
    if (cached) {
      res.status(200).json(cached);
      return;
    }
    const response = await axios.get(`${BASE_URL}/stocks`, {
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    cache.set("stocks", response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ error: "An error occurred while fetching stocks." });
  }
});

app.get("/stocks/:ticker", async (req, res) => {
  try {
    const { ticker } = req.params;
    // default to 2 minutes
    const minutes = req.query.minutes || 2;
    // default to average, no specific requirement specified
    const aggregation = req.query.aggregation || "average";
    const cacheKey = `${ticker}=${minutes}`;
    const cached = cache.get<StockPrice[]>(cacheKey);
    if (cached) {
      res.status(200).json(cached);
      return;
    }
    const response = await axios.get(
      `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );
    const prices = Array.isArray(response.data)
      ? response.data
      : [response.data.stock];
    const sum = prices.reduce((acc, curr) => acc + curr.price, 0);
    const average = sum / prices.length;
    const result = {
      averageStockPrice: average,
      priceHistory: prices,
    };
    cache.set(cacheKey, result);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "An error occurred while fetching stock data.",
    });
  }
});

app.get("/stockcorrelation", async (req, res) => {
  try {
    const { minutes, ticker } = req.query;
    const minutesNum = Number(minutes);

    // Parse ticker parameters and clean them
    let rawTickers: any = Array.isArray(ticker) ? ticker : [ticker];
    const tickers = rawTickers.map((t: string) =>
      t.replace(/[{}]/g, "").trim()
    );

    if (tickers.length < 2) {
      res.status(400).json({ error: "Please provide at least two tickers." });
      return;
    }

    // Get data for first two tickers
    const [stockA, stockB] = await Promise.all(
      tickers.map(async (ticker: string): Promise<StockPrice[]> => {
        const response = await axios.get(
          `${BASE_URL}/stocks/${ticker}?minutes=${minutes}`,
          {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
          }
        );
        const result: StockPrice[] = Array.isArray(response.data)
          ? response.data
          : [response.data.stock];

        return result;
      })
    );

    // Extract just the prices - assuming timestamps are already aligned or we don't care
    const pricesA: number[] = stockA.map((item: any) => item.price);
    const pricesB: number[] = stockB.map((item: any) => item.price);

    // Use the shorter array length
    const n = Math.min(pricesA.length, pricesB.length);

    if (n < 2) {
      res.status(400).json({ error: "Not enough data points for correlation" });
      return;
    }

    // Calculate means
    const meanA =
      pricesA.slice(0, n).reduce((sum, price) => sum + price, 0) / n;
    const meanB =
      pricesB.slice(0, n).reduce((sum, price) => sum + price, 0) / n;

    // Calculate covariance and variances
    let covariance = 0;
    let varA = 0;
    let varB = 0;

    for (let i = 0; i < n; i++) {
      const diffA = pricesA[i] - meanA;
      const diffB = pricesB[i] - meanB;
      covariance += diffA * diffB;
      varA += diffA * diffA;
      varB += diffB * diffB;
    }

    covariance /= n - 1;
    varA /= n - 1;
    varB /= n - 1;

    const stdA = Math.sqrt(varA);
    const stdB = Math.sqrt(varB);

    // Calculate correlation
    let correlation = 0;
    if (stdA > 0 && stdB > 0) {
      correlation = covariance / (stdA * stdB);
    }

    // Return results
    res.status(200).json({
      correlation,
      covariance,
      standardDeviation: {
        [tickers[0]]: stdA,
        [tickers[1]]: stdB,
      },
      stocks: {
        [tickers[0]]: {
          averagePrice: meanA,
          priceCount: pricesA.length,
        },
        [tickers[1]]: {
          averagePrice: meanB,
          priceCount: pricesB.length,
        },
      },
    });
  } catch (error: any) {
    console.error("Error calculating correlation:", error);
    res.status(500).json({
      error:
        error?.message || "An error occurred while calculating correlation.",
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
