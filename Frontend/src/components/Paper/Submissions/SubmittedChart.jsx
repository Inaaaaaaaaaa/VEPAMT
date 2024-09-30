// SubmittedPieChart.jsx
import React, { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './PieChart.css'; 

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const SubmittedPieChart = ({ statusCounts }) => {
  const chartRef = useRef(null); 

  useEffect(() => {
    if (chartRef.current && statusCounts) {
      const ctx = chartRef.current.getContext('2d');

      // Calculate the total count of all statuses
      const total = Object.values(statusCounts).reduce((acc, count) => acc + count, 0);
      const submittedCount = statusCounts.submitted || 0;
      const notSubmittedCount = total - submittedCount;

      // Prepare data specifically for "submitted" status
      const chartData = {
        labels: ['Submitted'],
        datasets: [{
          data: [
            submittedCount, 
            notSubmittedCount
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)', // Blue for submitted
            'rgba(153, 102, 255, 0.8)' // Purple for not submitted
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
              text: 'Submitted Status Distribution'
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
      <canvas ref={chartRef} id="submittedPieChart"></canvas>
    </div>
  );
};

export default SubmittedPieChart;
