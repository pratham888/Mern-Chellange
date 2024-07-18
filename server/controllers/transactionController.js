const axios = require('axios');
const Transaction = require('../models/transaction');

exports.initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;
    await Transaction.deleteMany({});
    await Transaction.insertMany(transactions);
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error initializing database' });
  }
};

exports.listTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;
  try {
    const query = {
      dateOfSale: { $regex: `-${month}-` },
      ...(search && {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $regex: search, $options: 'i' } },
        ],
      }),
    };
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));
    const totalTransactions = await Transaction.countDocuments(query);
    res.status(200).json({
      transactions,
      totalPages: Math.ceil(totalTransactions / perPage),
    });
  } catch (error) {
    res.status(500).json({ error: 'Error listing transactions' });
  }
};

exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  try {
    const transactions = await Transaction.find({ dateOfSale: { $regex: `-${month}-` } });
    const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
    const totalSoldItems = transactions.filter(transaction => transaction.sold).length;
    const totalNotSoldItems = transactions.length - totalSoldItems;
    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error getting statistics' });
  }
};

exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  try {
    const transactions = await Transaction.find({ dateOfSale: { $regex: `-${month}-` } });
    const ranges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-200', min: 101, max: 200 },
      { range: '201-300', min: 201, max: 300 },
      { range: '301-400', min: 301, max: 400 },
      { range: '401-500', min: 401, max: 500 },
      { range: '501-600', min: 501, max: 600 },
      { range: '601-700', min: 601, max: 700 },
      { range: '701-800', min: 701, max: 800 },
      { range: '801-900', min: 801, max: 900 },
      { range: '901-above', min: 901, max: Infinity },
    ];
    const barChart = ranges.map(({ range, min, max }) => ({
      range,
      count: transactions.filter(transaction => transaction.price >= min && transaction.price <= max).length,
    }));
    res.status(200).json(barChart);
  } catch (error) {
    res.status(500).json({ error: 'Error getting bar chart data' });
  }
};

exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  try {
    const transactions = await Transaction.find({ dateOfSale: { $regex: `-${month}-` } });
    const categories = [...new Set(transactions.map(transaction => transaction.category))];
    const pieChart = categories.map(category => ({
      category,
      count: transactions.filter(transaction => transaction.category === category).length,
    }));
    res.status(200).json(pieChart);
  } catch (error) {
    res.status(500).json({ error: 'Error getting pie chart data' });
  }
};

exports.getCombinedData = async (req, res) => {
  const { month } = req.query;
  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      Transaction.find({ dateOfSale: { $regex: `-${month}-` } }),
      this.getStatistics({ query: { month } }, { json: (data) => data }),
      this.getBarChart({ query: { month } }, { json: (data) => data }),
      this.getPieChart({ query: { month } }, { json: (data) => data }),
    ]);
    res.status(200).json({
      transactions,
      statistics,
      barChart,
      pieChart,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error getting combined data' });
  }
};
