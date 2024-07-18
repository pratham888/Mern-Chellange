import React from 'react';
import {  Typography, Paper } from '@mui/material';

const TransactionStatistics = ({ statistics }) => {
  return (
    <Paper sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6">Transaction Statistics</Typography>
      <Typography>Total Sale Amount: {statistics.totalSaleAmount}</Typography>
      <Typography>Total Sold Items: {statistics.totalSoldItems}</Typography>
      <Typography>Total Not Sold Items: {statistics.totalNotSoldItems}</Typography>
    </Paper>
  );
};

export default TransactionStatistics;
