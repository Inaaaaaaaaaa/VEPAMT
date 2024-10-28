import React from "react";
import DoughnutChart from "../Charts/DoughnutChart";

function SubmissionCard2({ title, waitingForAssign, assignedToday }) {
  const chartData = {
    labels: ['Waiting for Decision', 'Decision made Today'],
    datasets: [
      {
        label: 'Reviewer Assignment Status',
        data: [waitingForAssign, assignedToday],
        backgroundColor: ['#4F46E5', '#F87171'], // Indigo for waiting, Red for assigned
        hoverBackgroundColor: ['#4338CA', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 min-h-[300px]">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        {/* 动态标题 */}
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      </header>
      <DoughnutChart data={chartData} width={389} height={260} />
      <div className="px-5 pt-2 pb-6 text-center">
        <div className="flex justify-center space-x-4">
          <div className="flex items-center">
            <span className="block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#4F46E5' }}></span>
            <span className="text-sm text-slate-800 dark:text-slate-100">Waiting for Decision: {waitingForAssign}</span>
          </div>
          <div className="flex items-center">
            <span className="block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: '#F87171' }}></span>
            <span className="text-sm text-slate-800 dark:text-slate-100">Decision made Today: {assignedToday}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubmissionCard2;
