import React, { useEffect, useRef } from 'react';
import { Chart, PieController, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import './PendingChart.css'; 

Chart.register(PieController, ArcElement, Tooltip, Legend, Title);

const PendingChart = ({ statusCounts }) => {

  const chartRef = useRef(null); 

  useEffect(() => {
    if (chartRef.current && statusCounts) {
      const ctx = chartRef.current.getContext('2d');
      const chartData = {
        labels: Object.keys(statusCounts),
        datasets: [{
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      };

      //cart constructor
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
              text: 'Submission Status Distribution'
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

  //chart container
  return (
    <div className="chart-container">
      <canvas ref={chartRef} id="myPieChart"></canvas>
    </div>
  );
};

export default PendingChart;
