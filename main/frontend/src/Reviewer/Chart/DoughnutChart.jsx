import React, { useRef, useEffect, useState } from 'react';
import { Chart, DoughnutController, ArcElement, Tooltip } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(DoughnutController, ArcElement, Tooltip);

function DoughnutChart({ data, width, height }) {
  const [chart, setChart] = useState(null);
  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        cutout: '80%',
        plugins: {
          legend: {
            display: false, // 隐藏默认图例
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed} items`,
            },
          },
        },
        maintainAspectRatio: false,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
  }, [data]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvas} width={width} height={height}></canvas>
    </div>
  );
}

export default DoughnutChart;
