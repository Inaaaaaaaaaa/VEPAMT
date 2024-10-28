import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, CategoryScale); // 注册所有需要的组件

function LineChart2({ data, options }) {
  return (
    <div className="grow">
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChart2;
