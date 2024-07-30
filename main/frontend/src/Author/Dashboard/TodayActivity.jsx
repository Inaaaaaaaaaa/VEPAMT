// TodayActivity.jsx
import React from 'react';

const activities = [
  { hour: 9, title: 'Morning Meeting' },
  { hour: 14, title: 'Lunch with Team' },
  { hour: 14, title: 'Client Call' },
  { hour: 16, title: 'Project Review' },
  { hour: 20, title: 'Dinner with Client' },
  { hour: 20, title: 'Team Sync' },
  { hour: 20, title: 'Evening Walk' }, // This third activity should not be displayed
];

function TodayActivity() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-6 w-full">
      <div className="text-lg font-bold mb-2 text-center">Today's Activity</div>
      <div className="grid grid-cols-1 gap-2">
        {Array.from({ length: 24 }, (_, hour) => (
          <div key={hour} className="flex items-center border-b last:border-b-0">
            <div className="w-12 text-center py-1">{hour}:00</div>
            <div className="flex-1 py-1">
              {activities
                .filter(activity => activity.hour === hour)
                .slice(0, 3) // Only take the first two activities
                .map((activity, index) => (
                  <div key={index} className="bg-blue-100 rounded-lg p-2 mb-1">
                    {activity.title}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodayActivity;
