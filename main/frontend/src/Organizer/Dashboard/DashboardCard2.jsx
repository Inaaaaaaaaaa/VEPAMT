import React from 'react';
import BarChart2 from '../Charts/BarChart2';

function DashboardCard2({ data }) {
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-70 ">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Accept vs Reject</h2>
        {/* 图例 */}
        <div className="flex space-x-4 mt-2">
          <div className="flex items-center">
            <span className="block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#4F46E5' }}></span>
            <span className="text-sm text-slate-800 dark:text-slate-100">Accept</span>
          </div>
          <div className="flex items-center">
            <span className="block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#F87171' }}></span>
            <span className="text-sm text-slate-800 dark:text-slate-100">Reject</span>
          </div>
        </div>
      </header>

      {/* Chart built with Chart.js */}
      <BarChart2 data={data} width={595} height={248} />
    </div>
  );
}

export default DashboardCard2;
