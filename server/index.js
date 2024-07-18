const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Transaction = require('./models/Transaction'); // Make sure the path is correct

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Initialize database with seed data
app.get('/api/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);
    res.status(200).send('Database initialized');
  } catch (error) {
    console.error('Error initializing database', error);
    res.status(500).send('Error initializing database');
  }
});

// API to list all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;
  const regex = new RegExp(search, 'i');
  try {
    const transactions = await Transaction.find({
      $or: [
        { title: regex },
        { description: regex },
        { price: regex }
      ]
    })
      .skip((page - 1) * perPage)
      .limit(Number(perPage));
    const total = await Transaction.countDocuments({
      $or: [
        { title: regex },
        { description: regex },
        { price: regex }
      ]
    });
    res.json({ transactions, total });
  } catch (error) {
    console.error('Error fetching transactions', error);
    res.status(500).send('Error fetching transactions');
  }
});

// API for statistics
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;
  const start = new Date(`${month} 1, 2022`);
  const end = new Date(`${month} 1, 2022`);
  end.setMonth(end.getMonth() + 1);

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: start, $lt: end }, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: start, $lt: end }, sold: false });

    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching statistics', error);
    res.status(500).send('Error fetching statistics');
  }
});

// API for bar chart
app.get('/api/bar-chart', async (req, res) => {
  const { month } = req.query;
  const start = new Date(`${month} 1, 2022`);
  const end = new Date(`${month} 1, 2022`);
  end.setMonth(end.getMonth() + 1);

  try {
    const priceRanges = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);
    res.json(priceRanges);
  } catch (error) {
    console.error('Error fetching bar chart data', error);
    res.status(500).send('Error fetching bar chart data');
  }
});

// API for pie chart
app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;
  const start = new Date(`${month} 1, 2022`);
  const end = new Date(`${month} 1, 2022`);
  end.setMonth(end.getMonth() + 1);

  try {
    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching pie chart data', error);
    res.status(500).send('Error fetching pie chart data');
  }
});

// Combined API
app.get('/api/combined', async (req, res) => {
  const { month } = req.query;
  const start = new Date(`${month} 1, 2022`);
  const end = new Date(`${month} 1, 2022`);
  end.setMonth(end.getMonth() + 1);

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: start, $lt: end }, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ dateOfSale: { $gte: start, $lt: end }, sold: false });

    const priceRanges = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
          default: "Other",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({
      statistics: {
        totalSaleAmount: totalSaleAmount[0]?.total || 0,
        totalSoldItems,
        totalNotSoldItems
      },
      barChart: priceRanges,
      pieChart: categories
    });
  } catch (error) {
    console.error('Error fetching combined data', error);
    res.status(500).send('Error fetching combined data');
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
