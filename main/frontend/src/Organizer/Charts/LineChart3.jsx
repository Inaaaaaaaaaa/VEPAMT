import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function LineChart3({ datasets }) {
  // 初始化所有数据线为可见
  const [visibleDatasets, setVisibleDatasets] = useState(
    datasets.map(() => true)
  );

  // 用于切换数据线的显示状态
  const toggleDatasetVisibility = (index) => {
    const newVisibility = [...visibleDatasets];
    newVisibility[index] = !newVisibility[index];
    setVisibleDatasets(newVisibility);
  };

  // 筛选出可见的数据线
  const filteredDatasets = datasets.map((dataset, index) => ({
    ...dataset,
    hidden: !visibleDatasets[index],
  }));

  const chartData = {
    labels: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06'],
    datasets: filteredDatasets,
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        {datasets.map((dataset, index) => (
          <label key={index} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={visibleDatasets[index]}
              onChange={() => toggleDatasetVisibility(index)}
            />
            <span style={{ color: dataset.borderColor }}>{dataset.label}</span>
          </label>
        ))}
      </div>
      <Line data={chartData} />
    </div>
  );
}

export default LineChart3;
