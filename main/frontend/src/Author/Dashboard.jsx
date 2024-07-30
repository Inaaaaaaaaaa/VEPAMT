// Dashboard.js
import React from 'react';
import ToDoList from './Dashboard/ToDoList';
import RecentSubmit from './Dashboard/RecentSubmit';
import SmallCalendar from './Dashboard/SmallCalendar';
import TodayActivity from './Dashboard/TodayActivity';

function Dashboard() {
  return (
    <div className="relative bg-gray-100 p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="flex space-x-6">
        <RecentSubmit />
        <ToDoList />
        <div className="flex flex-col items-center">
          <SmallCalendar />
          <TodayActivity />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
