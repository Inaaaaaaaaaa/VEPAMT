import React from 'react';

function DashboardCard5() {
  // 模拟从后端获取的submission数据
  const submissions = [
    { paperName: 'Paper A', track: 'Track 1', status: 'Pending', submissionTime: '2023-08-19T01:00:00Z' },
    { paperName: 'Paper B', track: 'Track 2', status: 'Assigned', submissionTime: '2023-08-19T05:00:00Z' },
    { paperName: 'Paper C', track: 'Track 3', status: 'Pending', submissionTime: '2023-08-18T22:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2023-08-19T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2023-08-18T18:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2023-08-19T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2023-08-18T18:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2023-08-19T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2024-08-19T08:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2023-08-19T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2023-08-18T18:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2023-08-19T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2023-08-18T18:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2024-09-03T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2023-08-18T18:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2023-08-19T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2023-08-18T18:00:00Z' },
    { paperName: 'Paper D', track: 'Track 4', status: 'Assigned', submissionTime: '2023-08-19T09:00:00Z' },
    { paperName: 'Paper E', track: 'Track 5', status: 'Pending', submissionTime: '2023-08-18T18:00:00Z' },
    // 更多模拟数据
  ];

  // 根据状态设置颜色
  const getStatusColor = (status) => {
    return status === 'Pending' ? 'text-yellow-500' : 'text-green-500';
  };

  // 根据时间设置颜色
  const getTimeColor = (submissionTime) => {
    const currentTime = new Date();
    const submissionDate = new Date(submissionTime);
    const hoursAgo = (currentTime - submissionDate) / (1000 * 60 * 60); // 计算时间差（小时）
    return hoursAgo > 10 ? 'text-red-500' : 'text-yellow-500'; // 超过10小时为红色，低于10小时为黄色
  };

  // 获取距离现在的时间（例如：'1 hour ago'）
  const getTimeAgo = (submissionTime) => {
    const currentTime = new Date();
    const submissionDate = new Date(submissionTime);
    const hoursAgo = Math.floor((currentTime - submissionDate) / (1000 * 60 * 60));
    
    if (hoursAgo === 0) return '<1h ago';
    return `${hoursAgo}h ago`;
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-5 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 min-h-[300px]">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Recent Submissions</h2>
      </header>
      <div className="px-5 py-4 h-full max-h-[380px] overflow-y-auto">
        <ul>
          {submissions.map((submission, index) => (
            <li key={index} className="py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{submission.paperName}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">{submission.track}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`text-sm font-semibold ${getStatusColor(submission.status)}`}>
                    {submission.status}
                  </div>
                  <div className={`text-sm ${getTimeColor(submission.submissionTime)}`}>
                    {getTimeAgo(submission.submissionTime)}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DashboardCard5;
