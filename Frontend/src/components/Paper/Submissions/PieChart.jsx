// PieChart.jsx (First Graph)
import React, { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './PieChart.css';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const PieChart = ({ statusCounts }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && statusCounts) {
      const ctx = chartRef.current.getContext('2d');

      // Get counts for "Unsubmitted" and "Rejected"
      const unsubmittedCount = statusCounts['Unsubmitted'] || 0;
      const rejectedCount = statusCounts['Rejected'] || 0;

      const chartData = {
        labels: ['Unsubmitted', 'Rejected'],
        datasets: [{
          data: [unsubmittedCount, rejectedCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)', // Color for Unsubmitted
            'rgba(255, 206, 86, 0.8)' // Color for Rejected
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      };

      // Chart constructor
      const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
            },
            title: {
              display: true,
              text: 'Unsubmitted and Rejected Status Distribution'
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true
          }
        }
      });

      // Cleanup on component unmount
      return () => {
        myPieChart.destroy();
      };
    }
  }, [statusCounts]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} id="myPieChart"></canvas>
    </div>
  );
};

export default PieChart;
