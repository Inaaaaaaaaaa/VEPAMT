import React, { useRef, useEffect, useState } from 'react';
import { Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function LineChart1({ data, width, height }) {
  const canvas = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            display: true, // 显示 y 轴
          },
          x: {
            type: 'time',
            time: {
              unit: 'month',
            },
            display: true, // 显示 x 轴
          },
        },
        plugins: {
          tooltip: {
            // 使用默认的 tooltip 格式，不需要自定义回调
          },
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
  }, [data]);

  return (
    <canvas ref={canvas} width={width} height={height}></canvas>
  );
}

export default LineChart1;
