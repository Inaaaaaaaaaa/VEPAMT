import React from "react";
import DoughnutChart from "../Chart/DoughnutChart";

const DashboardCard1 = () => {
  // 图表数据: 未完成和已完成的审稿统计
  const reviewCompletionData = {
    labels: ["Unreview", "Reviewed"],
    datasets: [
      {
        label: "Review Completion",
        data: [3, 7], // 比如3篇未完成，7篇已完成
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  // 图表数据: 审核文章的种类对比
  const articleTypeData = {
    labels: ["type1", "type2", "type3"],
    datasets: [
      {
        label: "Article Types",
        data: [5, 3, 2], // 不同类型的文章数量
        backgroundColor: ["#FFCE56", "#4BC0C0", "#FF6384"],
        hoverBackgroundColor: ["#FFCE56", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  // 图表数据: 评分分布（从0到5分）
  const ratingDistributionData = {
    labels: ["0", "1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Rating Distribution",
        data: [1, 0, 2, 3, 4, 5], // 每个评分对应的文章数量
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      },
    ],
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">Reviewer Data</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-lg font-semibold mb-2">Review process</h4>
          <DoughnutChart data={reviewCompletionData} width={200} height={200} />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Article Types</h4>
          <DoughnutChart data={articleTypeData} width={200} height={200} />
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-2">Marks</h4>
          <DoughnutChart data={ratingDistributionData} width={200} height={200} />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard1;
