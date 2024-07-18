import React from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import { Paper, Box, Typography } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TransactionPieChart = ({ data }) => {
  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h6">Transaction Pie Chart</Typography>
      </Box>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </Paper>
  );
};

export default TransactionPieChart;
