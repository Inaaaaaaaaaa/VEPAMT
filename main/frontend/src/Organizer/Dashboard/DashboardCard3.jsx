import React, { useState, useEffect } from 'react';
import RealtimeChart from '../Charts/RealtimeChart';

function DashboardCard3({ acceptRejectData }) {
  const [isShowingAccept, setIsShowingAccept] = useState(true);
  const latestAcceptValue = acceptRejectData.datasets[0].data[acceptRejectData.datasets[0].data.length - 1];
  const latestRejectValue = acceptRejectData.datasets[1].data[acceptRejectData.datasets[1].data.length - 1];
  const previousAcceptValue = acceptRejectData.datasets[0].data[acceptRejectData.datasets[0].data.length - 2] || latestAcceptValue;
  const previousRejectValue = acceptRejectData.datasets[1].data[acceptRejectData.datasets[1].data.length - 2] || latestRejectValue;

  // 计算百分比变化
  const calculatePercentageChange = (newValue, oldValue) => {
    if (oldValue === 0) return 0;
    return ((newValue - oldValue) / oldValue) * 100;
  };

  const acceptPercentageChange = calculatePercentageChange(latestAcceptValue, previousAcceptValue);
  const rejectPercentageChange = calculatePercentageChange(latestRejectValue, previousRejectValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsShowingAccept((prev) => !prev); // 每2秒切换一次图表
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: acceptRejectData.labels,
    datasets: [
      {
        label: isShowingAccept ? 'Accept' : 'Reject',
        data: isShowingAccept ? acceptRejectData.datasets[0].data : acceptRejectData.datasets[1].data,
        borderColor: isShowingAccept ? '#4F46E5' : '#F87171',
        backgroundColor: isShowingAccept ? 'rgba(79, 70, 229, 0.08)' : 'rgba(248, 113, 113, 0.08)',
        borderWidth: 2,
        pointRadius: 5,
        fill: true,
      },
    ],
  };

  const latestValue = isShowingAccept ? latestAcceptValue : latestRejectValue;
  const percentageChange = isShowingAccept ? acceptPercentageChange : rejectPercentageChange;

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 min-h-[333px]">
      <RealtimeChart
        data={chartData}
        width={595}
        height={248}
        latestValue={latestValue}
        percentageChange={percentageChange}
      />
    </div>
  );
}

export default DashboardCard3;
