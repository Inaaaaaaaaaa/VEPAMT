// PieChart.jsx
import React, { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './PieChart.css'; 

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const PieChart = ({ statusCounts }) => {
  const chartRef = useRef(null); 

  useEffect(() => {
    if (chartRef.current && statusCounts) {
      const ctx = chartRef.current.getContext('2d');

      // Get count for "Unsubmitted" and "Other Statuses"
      const unsubmittedCount = statusCounts.unsubmitted || 0;
      const otherCount = Object.values(statusCounts).reduce((acc, count) => acc + count, 0) - unsubmittedCount;

      const chartData = {
        labels: ['Unsubmitted'],
        datasets: [{
          data: [unsubmittedCount, otherCount],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)', // Color for Unsubmitted
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
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
              text: 'Unsubmitted Status Distribution'
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

  // Chart container
  return (
    <div className="chart-container">
      <canvas ref={chartRef} id="myPieChart"></canvas>
    </div>
  );
};

export default PieChart;
