import React from 'react';
import LineChart1 from '../Charts/LineChart1';

function SubmissionCard1({ title, data }) {
  // 获取最新的数值 (假设数据集是按照时间顺序排列的)
  const latestValue = data.datasets[0].data[data.datasets[0].data.length - 1];
  const previousValue = data.datasets[0].data[data.datasets[0].data.length - 2] || latestValue;
  
  // 计算百分比变化
  const percentageChange = ((latestValue - previousValue) / previousValue) * 100;
  
  // 设置百分比颜色：增长为绿色，下降为红色
  const percentageColor = percentageChange >= 0 ? 'bg-emerald-500' : 'bg-rose-500';
  
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white shadow-lg rounded-sm border border-slate-200 min-h-[370px]">
      <div className="px-5 pt-5">
        <header className="flex justify-between items-start mb-2">
          {/* Card Title */}
          <h2 className="text-lg font-semibold text-slate-800 mb-2">{title}</h2>
        </header>
        
        {/* 当前数值和百分比变化 */}
        <div className="flex items-start mb-4">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{latestValue}</div>
          <div className={`text-sm font-semibold text-white px-1.5 rounded-full ${percentageColor}`}>
            {percentageChange >= 0 ? `+${percentageChange.toFixed(2)}%` : `${percentageChange.toFixed(2)}%`}
          </div>
        </div>
        
        {/* Line Chart */}
        <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
          <LineChart1 data={data} width={389} height={128} />
        </div>
      </div>
    </div>
  );
}

export default SubmissionCard1;
