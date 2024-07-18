const express = require('express');
const {
  initializeDatabase,
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} = require('../controllers/transactionController');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/', listTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChart);
router.get('/pie-chart', getPieChart);
router.get('/combined', getCombinedData);

module.exports = router;
