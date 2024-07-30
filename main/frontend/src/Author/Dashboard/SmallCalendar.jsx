// SmallCalendar.jsx
import React from 'react';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

function SmallCalendar() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg">
      <div className="text-lg font-bold mb-2 text-center">July 2024</div>
      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-500">{day}</div>
        ))}
        {daysInMonth.map((day) => (
          <div
            key={day}
            className="text-center p-2 rounded-lg hover:bg-blue-100 cursor-pointer"
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmallCalendar;
