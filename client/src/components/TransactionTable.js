import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box } from '@mui/material';

const TransactionTable = ({ transactions, onSearch, onPageChange, searchValue, page, totalPages }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <TextField 
        label="Search" 
        variant="outlined" 
        value={searchValue} 
        onChange={(e) => onSearch(e.target.value)} 
        fullWidth
        sx={{ mb: 2 }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date of Sale</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.title}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.price}</TableCell>
                <TableCell>{transaction.dateOfSale}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="contained" onClick={() => onPageChange(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <Button variant="contained" onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default TransactionTable;
