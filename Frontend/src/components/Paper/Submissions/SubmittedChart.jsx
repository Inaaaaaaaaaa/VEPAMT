// SubmittedPieChart.jsx (Second Graph)
import React, { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './PieChart.css';

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const SubmittedPieChart = ({ statusCounts }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && statusCounts) {
      const ctx = chartRef.current.getContext('2d');

      // Get counts for "Submitted" and "Pending"
      const submittedCount = statusCounts['Submitted'] || 0;
      const pendingCount = statusCounts['Pending'] || 0;

      // Prepare data specifically for "Submitted" and "Pending" statuses
      const chartData = {
        labels: ['Submitted', 'Pending'],
        datasets: [{
          data: [submittedCount, pendingCount],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)', // Blue for Submitted
            'rgba(153, 102, 255, 0.8)' // Purple for Pending
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)'
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
              text: 'Submitted and Pending Status Distribution'
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
      <canvas ref={chartRef} id="submittedPieChart"></canvas>
    </div>
  );
};

export default SubmittedPieChart;
