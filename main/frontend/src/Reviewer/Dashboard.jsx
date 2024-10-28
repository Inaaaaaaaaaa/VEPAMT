import React from "react";
import WelcomeBanner from "./Dashboard/WelcomeBanner";
import DashboardCard1 from "./Dashboard/DashboardCard1"; 
import SmallCalendar from "./Dashboard/SamllCalendar";
import DashboardCard2 from "./Dashboard/DashboardCard2";
import ActivityCard from "./Dashboard/ActivityCard";

const Dashboard = () => {

  const events = [
    { type: 'assignment', person: 'Reviewer A', action: 'was assigned to Paper X' },
    { type: 'submission', person: 'Author B', action: 'made a new submission' },
    { type: 'review', person: 'Reviewer C', action: 'sent a review' },
    { type: 'message', person: 'Admin', action: 'posted a new message' },
  ];
  

  const duedays = [
    { day: 5, due: 2 },
    { day: 12, due: 1 },
    { day: 18, due: 3 },
    { day: 25, due: 4 },
  ];

  const recentSubmissions = [
    { id: 1, title: 'Machine Learning Paper', date: '2024-09-21' },
    { id: 2, title: 'AI Research', date: '2024-09-21' },
    { id: 3, title: 'Quantum Computing Paper', date: '2024-09-21' },
    { id: 4, title: 'Deep Learning Advances', date: '2024-09-21' },
    { id: 5, title: 'Blockchain Innovations', date: '2024-09-21' },
    { id: 6, title: 'Natural Language Processing', date: '2024-09-21' },
    
    // More submissions...
  ];

  return (
    <div className="col-span-12">
      <WelcomeBanner name="Reviewer" />
      <DashboardCard1 /> {/* 调用 DashboardCard1 */}
      <br></br>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 左边: Small Calendar */}
      <div className="col-span-1">
        <SmallCalendar duedays={duedays} />
      </div>

      {/* 右边: Recent Submissions */}
      <div className="col-span-1">
        <DashboardCard2 submissions={recentSubmissions} />
      </div>
      <br></br>
      <ActivityCard events={events} />
      
    </div>
    </div>

    
  );
};

export default Dashboard;
