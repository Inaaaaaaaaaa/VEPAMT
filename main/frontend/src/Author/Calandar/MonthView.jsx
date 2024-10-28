import React, { useEffect, useState } from "react";
import { fetchCalendarData } from "../../api";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MonthView = () => {
  const [calendarData, setCalendarData] = useState({
    calendarDates: [],
    events: {},
  });
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    fetchCalendarData(year, month).then((data) => {
      console.log("Fetched data:", data);
      setCalendarData(data);
      setCurrentMonth(
        today.toLocaleString("default", { month: "long", year: "numeric" })
      );
    });
  }, []);

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 text-center text-xl font-bold text-gray-700">
        {currentMonth}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-white py-2 text-center font-bold text-gray-700"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {calendarData.calendarDates.map((date) => {
          const dateObj = new Date(date);
          const isCurrentMonth = dateObj.getMonth() === new Date().getMonth();
          const events = calendarData.events[date] || [];

          return (
            <div
              key={date}
              className={`bg-white h-24 p-2 ${
                isCurrentMonth ? "text-gray-900" : "text-gray-400"
              }`}
            >
              <div>{dateObj.getDate()}</div>
              {events.map((event, idx) => (
                <div key={`${date}-${event.eventID|| idx}`} className="mt-1 text-xs">
                  <span className="text-blue-500">
                    {event.title} at {event.dueTime.slice(0, 5)}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
