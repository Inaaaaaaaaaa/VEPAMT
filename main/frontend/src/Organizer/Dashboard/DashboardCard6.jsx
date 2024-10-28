import React from 'react';
import LineChart2 from '../Charts/LineChart2'; 

function DashboardCard6() {
  // 模拟最近5个月的Assigned和Submission数据，集中在一个对象里
  const data = {
    labels: ['April', 'May', 'June', 'July', 'August'],
    assigned: [20, 30, 25, 40, 35],  // 每月的Assigned数量
    submissions: [50, 60, 55, 70, 65],  // 每月的Submission数量
  };

  // 本月与上月的Assigned数量对比
  const latestAssigned = data.assigned[data.assigned.length - 1];
  const previousAssigned = data.assigned[data.assigned.length - 2];
  const percentageChange = ((latestAssigned - previousAssigned) / previousAssigned) * 100;

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Assigned',
        data: data.assigned,
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.08)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: '#4F46E5',
        fill: true,
      },
      {
        label: 'Submissions',
        data: data.submissions,
        borderColor: '#F87171',
        backgroundColor: 'rgba(248, 113, 113, 0.08)',
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: '#F87171',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Months',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y} items`,
        },
      },
      legend: {
        display: true,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 min-h-[440px]">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Assigned vs Submissions</h2>
      </header>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">
            {latestAssigned} Assigned
          </div>
          <div
            className={`text-sm font-semibold text-white px-1.5 rounded-full ${
              percentageChange >= 0 ? 'bg-emerald-500' : 'bg-red-500'
            }`}
          >
            {percentageChange >= 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
          </div>
        </div>
      </div>
      <LineChart2 data={chartData} options={chartOptions} />
    </div>
  );
}

export default DashboardCard6;
