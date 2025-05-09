// src/pages/CorrelationPage/index.tsx
import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import { fetchStocks, fetchCorrelation } from "../../api/stockApi";
import Layout from "../../components/Layout";

interface CorrelationData {
  [key: string]: {
    [key: string]: number;
  };
}

export default function CorrelationPage() {
  const [stocks, setStocks] = useState<{ [key: string]: string }>({});
  const [minutes, setMinutes] = useState<number>(10);
  const [correlations, setCorrelations] = useState<CorrelationData>({});

  useEffect(() => {
    fetchStocks().then(setStocks);
  }, []);

  const handleSubmit = async () => {
    const tickers = Object.values(stocks);
    const newCorrelations: CorrelationData = {};

    for (let i = 0; i < tickers.length; i++) {
      for (let j = i + 1; j < tickers.length; j++) {
        const pair = [tickers[i], tickers[j]];
        const data = await fetchCorrelation(pair, minutes);
        if (!newCorrelations[pair[0]]) newCorrelations[pair[0]] = {};
        newCorrelations[pair[0]][pair[1]] = data.correlation;
      }
    }

    setCorrelations(newCorrelations);
  };

  return (
    <Layout>
      <Container maxWidth='lg' sx={{ mt: 4 }}>
        <Typography variant='h4' gutterBottom>
          Correlation Heatmap
        </Typography>
        <TextField
          type='number'
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          label='Minutes'
          sx={{ mr: 2 }}
        />
        <Button variant='contained' onClick={handleSubmit}>
          Generate Heatmap
        </Button>

        <Grid container spacing={2} sx={{ mt: 3 }}>
          {Object.entries(stocks).map(([name, ticker]) => (
            <Grid item xs={12} key={ticker}>
              <Paper sx={{ p: 2 }}>
                <Typography variant='h6' gutterBottom>
                  {name}
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(stocks).map(
                    ([otherName, otherTicker]) =>
                      ticker !== otherTicker && (
                        <Grid item xs={12} key={otherTicker}>
                          <Paper
                            sx={{
                              p: 1.5,
                              backgroundColor: correlations[ticker]?.[
                                otherTicker
                              ]
                                ? `rgba(25, 118, 210, ${Math.abs(
                                    correlations[ticker][otherTicker]
                                  )})`
                                : "#f5f5f5",
                              minWidth: 80,
                              textAlign: "center",
                            }}
                          >
                            <Typography variant='body2'>
                              {otherTicker}
                            </Typography>
                            <Typography variant='body1' fontWeight='bold'>
                              {correlations[ticker]?.[otherTicker]?.toFixed(
                                2
                              ) || "--"}
                            </Typography>
                          </Paper>
                        </Grid>
                      )
                  )}
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Layout>
  );
}
