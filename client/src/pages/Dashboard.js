import React, { useEffect, useState } from 'react';
import TransactionBarChart from '../components/TransactionBarChart';
import TransactionPieChart from '../components/TransactionPieChart';
import axios from 'axios';

const Dashboard = () => {
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  const fetchCombinedData = async (month) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/combined`, {
        params: { month }
      });
      setStatistics(response.data.statistics);
      setBarChartData(response.data.barChart);
      setPieChartData(response.data.pieChart);
    } catch (error) {
      console.error('Error fetching combined data', error);
    }
  };

  useEffect(() => {
    fetchCombinedData('March'); // default month
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Statistics</h2>
        <p>Total Sale Amount: ${statistics.totalSaleAmount}</p>
        <p>Total Sold Items: {statistics.totalSoldItems}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>
      <div>
        <h2>Bar Chart</h2>
        <TransactionBarChart data={barChartData} />
      </div>
      <div>
        <h2>Pie Chart</h2>
        <TransactionPieChart data={pieChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
