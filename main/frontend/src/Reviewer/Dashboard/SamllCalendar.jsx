import React, { useState, useEffect } from 'react';

const SmallCalendar = ({ duedays }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Set current date
    setCurrentDate(new Date());
  }, []);

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = currentDate.getDate();

    const totalDays = daysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    // Create an array to store each day of the month
    const daysArray = [];

    // Add empty cells to the start of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      daysArray.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    // Add the days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isToday = day === today;
      const isDue = duedays.find((due) => due.day === day);

      daysArray.push(
        <div
          key={day}
          className={`day ${isToday ? 'bg-blue-500 text-white' : ''} ${
            isDue ? 'bg-red-500 text-white' : ''
          } flex items-center justify-center relative border`}
        >
          {day}
          {isDue && (
            <span className="absolute bottom-0 right-0 text-xs text-white bg-black rounded-full w-5 h-5 flex items-center justify-center">
              {isDue.due}
            </span>
          )}
        </div>
      );
    }

    return daysArray;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4"> {/* Card styling */}
      <h3 className="text-lg font-semibold mb-4">{`${currentDate.getFullYear()} ${
        currentDate.getMonth() + 1
      }`}</h3>
      <div className="grid grid-cols-7 gap-1">
        <div className="day-label">Sun</div>
        <div className="day-label">Mon</div>
        <div className="day-label">Tue</div>
        <div className="day-label">Wed</div>
        <div className="day-label">Thu</div>
        <div className="day-label">Fri</div>
        <div className="day-label">Sat</div>
        {renderDays()}
      </div>
    </div>
  );
};

export default SmallCalendar;
