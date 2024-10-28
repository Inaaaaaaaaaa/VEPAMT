import React, { useRef, useEffect } from 'react';
import { Chart, LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(LineController, LineElement, Filler, PointElement, LinearScale, TimeScale, Tooltip);

function RealtimeChart({ data, width, height, latestValue, percentageChange, label }) {
  const canvas = useRef(null);

  useEffect(() => {
    const ctx = canvas.current;
    const newChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Quantity',
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'MM-DD-YYYY', // 解析 MM-DD-YYYY 格式的日期
              unit: 'month', // 显示为月
              tooltipFormat: 'MMM YYYY', // 工具提示显示的格式（例如 'Jan 2023'）
              displayFormats: {
                month: 'MMM YY', // X 轴显示的月份格式，如 'Jan 23'
              },
            },
            title: {
              display: true,
              text: 'Month',
            },
            ticks: {
              autoSkip: false, // 不跳过任何标签
              maxRotation: 0, // 禁止标签旋转
              minRotation: 0, // 禁止最小旋转
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y} ${label}`,
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        animation: false,
        maintainAspectRatio: false,
      },
    });

    return () => {
      newChart.destroy();
    };
  }, [data, label]);

  return (
    <React.Fragment>
      <div className="px-5 py-3">
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">
            {latestValue} {label}
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
      <div className="grow">
        <canvas ref={canvas} width={width} height={height}></canvas>
      </div>
    </React.Fragment>
  );
}

export default RealtimeChart;
