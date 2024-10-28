import React, { useState } from 'react';
import AnalyticsCard from './Analytics/AnalyticsCard';

// 空的子组件
function Submission() {
  return (
    <div className="flex flex-col p-6 bg-blue-100 dark:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Submission Management</h1>
      
      {/* 插入 AnalyticsCard 组件 */}
      <div className="mb-6">
        <AnalyticsCard />
      </div>

      {/* 其他内容 */}
      <p className="text-slate-800 dark:text-slate-100">This is the Submission page.</p>
    </div>
  );
}

function Review() {
  return (
    <div className="flex flex-col p-6 bg-blue-100 dark:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Review Management</h1>
      {/* 空内容 */}
      <p className="text-slate-800 dark:text-slate-100">This is the Review page.</p>
    </div>
  );
}

function Conference() {
  return (
    <div className="flex flex-col p-6 bg-blue-100 dark:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Conference Management</h1>
      {/* 空内容 */}
      <p className="text-slate-800 dark:text-slate-100">This is the Conference page.</p>
    </div>
  );
}

function Analytics() {
  const [activeTab, setActiveTab] = useState('Submission'); // 默认显示 Submission 页面

  // 根据选中的 tab 显示不同的内容
  const renderContent = () => {
    switch (activeTab) {
      case 'Submission':
        return <Submission />;
      case 'Review':
        return <Review />;
      case 'Conference':
        return <Conference />;
      default:
        return <Submission />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Schedule</h1>

      {/* 切换按钮 */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap -space-x-px w-1/2"> 
          <button
            className={`btn flex-1 text-center py-2 ${
              activeTab === 'Submission'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border'
            }`}
            onClick={() => setActiveTab('Submission')}
          >
            Submission
          </button>
          <button
            className={`btn flex-1 text-center py-2 ${
              activeTab === 'Review'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border'
            }`}
            onClick={() => setActiveTab('Review')}
          >
            Review
          </button>
          <button
            className={`btn flex-1 text-center py-2 ${
              activeTab === 'Conference'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 border'
            }`}
            onClick={() => setActiveTab('Conference')}
          >
            Conference
          </button>
        </div>
      </div>

      {/* 根据按钮切换显示不同的内容 */}
      <div className="mb-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default Analytics;
