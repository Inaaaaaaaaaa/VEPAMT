import React from 'react';
import DashboardCard1 from './Dashboard/DashboardCard1';
import DashboardCard2 from './Dashboard/DashboardCard2';
import WelcomeBanner from './Dashboard/WelcomeBanner';
import DashboardCard3 from './Dashboard/DashboardCard3';
import DashboardCard4 from './Dashboard/DashboardCard4'; 
import DashboardCard5 from './Dashboard/DashboardCard5';
import DashboardCard6 from './Dashboard/DashboardCard6';
import ActivityCard from './Dashboard/ActivityCard';

const events = [
  { type: 'assignment', person: 'Reviewer A', action: 'was assigned to Paper X' },
  { type: 'submission', person: 'Author B', action: 'made a new submission' },
  { type: 'review', person: 'Reviewer C', action: 'sent a review' },
  { type: 'message', person: 'Admin', action: 'posted a new message' },
];

function OrganizerDashboard() {
  // 模拟 Submission 数据
  const submissionData = {
    labels: ['01-01-2023', '02-01-2023', '03-01-2023', '04-01-2023'],
    datasets: [
      {
        data: [10, 20, 30, 40],
        fill: true,
        backgroundColor: 'rgba(0, 51, 102, 0.08)', // 深蓝色带透明
        borderColor: '#003366', // 深蓝色
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#003366',
      },
    ],
  };

  // 模拟 Conference 数据
  const conferenceData = {
    labels: ['01-01-2023', '02-01-2023', '03-01-2023', '04-01-2023'],
    datasets: [
      {
        data: [5, 15, 25, 35],
        fill: true,
        backgroundColor: 'rgba(0, 51, 102, 0.08)',
        borderColor: '#003366',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#003366',
      },
    ],
  };

  // 模拟 Reviewed 数据
  const reviewedData = {
    labels: ['01-01-2023', '02-01-2023', '03-01-2023', '04-01-2023'],
    datasets: [
      {
        data: [8, 18, 28, 18],
        fill: true,
        backgroundColor: 'rgba(0, 51, 102, 0.08)',
        borderColor: '#003366',
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointBackgroundColor: '#003366',
      },
    ],
  };

  // 模拟 Accept vs Reject 数据
  const acceptRejectData = {
    labels: ['01-01-2023', '02-01-2023', '03-01-2023', '04-01-2023'],
    datasets: [
      {
        label: 'Accept',
        data: [15, 25, 35, 45],
        backgroundColor: '#4F46E5', // Indigo color for Accept
        hoverBackgroundColor: '#4338CA',
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
      {
        label: 'Reject',
        data: [5, 10, 15, 20],
        backgroundColor: '#F87171', // Red color for Reject
        hoverBackgroundColor: '#EF4444',
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  // 模拟 Waiting 和 Assigned 数据
  const waitingForAssign = 20; // 等待分配的数量
  const assignedToday = 5; // 今天已分配的数量

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Welcome Banner */}
      <div className="col-span-12">
        <WelcomeBanner name="Organizer" />
      </div>

      {/* Dashboard Cards */}
      <DashboardCard1 title="New Submission" data={submissionData} />
      <DashboardCard1 title="New Conference" data={conferenceData} />
      <DashboardCard1 title="New Reviewed" data={reviewedData} />
      
      {/* Accept vs Reject Bar Chart 和 折线图 */}
      <div className="col-span-full sm:col-span-6">
        <DashboardCard2 data={acceptRejectData} />
      </div>
      <div className="col-span-full sm:col-span-6">
        <DashboardCard3 acceptRejectData={acceptRejectData} />
      </div>

     {/* 将 DashboardCard4、DashboardCard5 和 DashboardCard6 放在同一行 */}
     <div className="col-span-full xl:col-span-4">
        <DashboardCard4 waitingForAssign={waitingForAssign} assignedToday={assignedToday} />
      </div>
      <div className="col-span-full xl:col-span-4">
        <DashboardCard5 />
      </div>
      <div className="col-span-full xl:col-span-4">
        <DashboardCard6 />
      </div>


      <ActivityCard events={events} />
      <ActivityCard events={events} />
      
    </div>
  );
}

export default OrganizerDashboard;
