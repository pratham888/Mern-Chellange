import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper, Box, Typography } from '@mui/material';

const TransactionBarChart = ({ data }) => {
  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6">Transaction Bar Chart</Typography>
      </Box>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="priceRange" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </Paper>
  );
};

export default TransactionBarChart;
