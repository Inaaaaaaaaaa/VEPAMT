import React from 'react';
import LineChart3 from '../Charts/LineChart3';

function AnalyticsCard() {
  // 模拟数据集，最多6条线
  const datasets = [
    {
      label: 'Submission per Day',
      data: [10, 20, 15, 25, 30, 35],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
    },
    {
      label: 'Review per Day',
      data: [5, 15, 10, 20, 25, 30],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: false,
    },
    {
      label: 'Assigned Reviewer per Day',
      data: [8, 18, 12, 22, 28, 33],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
    },
    {
      label: 'Accepted Papers per Day',
      data: [2, 7, 5, 10, 13, 15],
      borderColor: 'rgba(153, 102, 255, 1)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      fill: false,
    },
    {
      label: 'Rejected Papers per Day',
      data: [1, 4, 3, 8, 10, 12],
      borderColor: 'rgba(255, 159, 64, 1)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      fill: false,
    },
    {
      label: 'Conferences Scheduled per Day',
      data: [3, 5, 7, 9, 11, 13],
      borderColor: 'rgba(255, 206, 86, 1)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      fill: false,
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-sm">
      <h2 className="text-2xl font-semibold mb-4">Analytics Overview</h2>
      <LineChart3 datasets={datasets} />
    </div>
  );
}

export default AnalyticsCard;
