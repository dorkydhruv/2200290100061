import { useState, useEffect } from 'react';
import { Container, Select, MenuItem, TextField, Button, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStocks, fetchStockData } from '../../api/stockApi';
import { StockResponse } from '../../components/StockChart/types';
import Layout from '../../components/Layout';

export default function StockPage() {
  const [stocks, setStocks] = useState<{ [key: string]: string }>({});
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [minutes, setMinutes] = useState<number>(10);
  const [data, setData] = useState<StockResponse | null>(null);

  useEffect(() => {
    fetchStocks().then(setStocks);
  }, []);

  const handleSubmit = async () => {
    if (selectedStock) {
      const result = await fetchStockData(selectedStock, minutes);
      setData(result);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Stock Analysis</Typography>
        <Select
          value={selectedStock}
          onChange={(e) => setSelectedStock(e.target.value as string)}
          sx={{ mr: 2, minWidth: 200 }}
        >
          {Object.entries(stocks).map(([name, ticker]) => (
            <MenuItem key={ticker} value={ticker}>{name}</MenuItem>
          ))}
        </Select>
        <TextField
          type="number"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          label="Minutes"
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>

        {data && (
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Average Price: {data.averageStockPrice.toFixed(2)}
            </Typography>
            <div style={{ height: '500px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="lastUpdatedAt" 
                    tickFormatter={(str) => new Date(str).toLocaleTimeString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#1976d2" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        )}
      </Container>
    </Layout>
  );
}