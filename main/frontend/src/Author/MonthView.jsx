import React from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const days = [
  { date: '2023-06-26', isCurrentMonth: false, events: [] },
  { date: '2023-06-27', isCurrentMonth: false, events: [] },
  { date: '2023-06-28', isCurrentMonth: false, events: [] },
  { date: '2023-06-29', isCurrentMonth: false, events: [] },
  { date: '2023-06-30', isCurrentMonth: false, events: [] },
  { date: '2023-07-01', isCurrentMonth: true, events: [] },
  { date: '2023-07-02', isCurrentMonth: true, events: [] },
  { date: '2023-07-03', isCurrentMonth: true, events: [
    { id: 1, name: 'Meeting', time: '10AM', datetime: '2023-07-03T10:00', href: '#' },
    { id: 2, name: 'Lunch', time: '12PM', datetime: '2023-07-03T12:00', href: '#' },
    
  ] },
  { date: '2023-07-04', isCurrentMonth: true, events: [] },
  { date: '2023-07-05', isCurrentMonth: true, events: [] },
  { date: '2023-07-06', isCurrentMonth: true, events: [] },
  { date: '2023-07-07', isCurrentMonth: true, events: [] },
  { date: '2023-07-08', isCurrentMonth: true, events: [] },
  { date: '2023-07-09', isCurrentMonth: true, events: [] },
  { date: '2023-07-10', isCurrentMonth: true, events: [] },
  { date: '2023-07-11', isCurrentMonth: true, events: [] },
  { date: '2023-07-12', isCurrentMonth: true, events: [{ id: 5, name: 'Conference', time: '2PM', datetime: '2023-07-12T14:00', href: '#' }] },
  { date: '2023-07-13', isCurrentMonth: true, events: [] },
  { date: '2023-07-14', isCurrentMonth: true, events: [] },
  { date: '2023-07-15', isCurrentMonth: true, events: [] },
  { date: '2023-07-16', isCurrentMonth: true, events: [] },
  { date: '2023-07-17', isCurrentMonth: true, events: [] },
  { date: '2023-07-18', isCurrentMonth: true, events: [] },
  { date: '2023-07-19', isCurrentMonth: true, events: [] },
  { date: '2023-07-20', isCurrentMonth: true, events: [] },
  { date: '2023-07-21', isCurrentMonth: true, events: [] },
  { date: '2023-07-22', isCurrentMonth: true, events: [{ id: 6, name: 'Webinar', time: '4PM', datetime: '2023-07-22T16:00', href: '#' }] },
  { date: '2023-07-23', isCurrentMonth: true, events: [] },
  { date: '2023-07-24', isCurrentMonth: true, events: [] },
  { date: '2023-07-25', isCurrentMonth: true, events: [] },
  { date: '2023-07-26', isCurrentMonth: true, events: [] },
  { date: '2023-07-27', isCurrentMonth: true, events: [] },
  { date: '2023-07-28', isCurrentMonth: true, events: [] },
  { date: '2023-07-29', isCurrentMonth: true, events: [] },
  { date: '2023-07-30', isCurrentMonth: true, events: [] },
  { date: '2023-07-31', isCurrentMonth: true, events: [] },
  { date: '2023-08-01', isCurrentMonth: false, events: [] },
  { date: '2023-08-02', isCurrentMonth: false, events: [] },
  { date: '2023-08-03', isCurrentMonth: false, events: [] },
  { date: '2023-08-04', isCurrentMonth: false, events: [] },
  { date: '2023-08-05', isCurrentMonth: false, events: [] },
  { date: '2023-08-06', isCurrentMonth: false, events: [] }
];


const MonthView = () => {

  const currentMonth = new Date(days.find(day => day.isCurrentMonth).date).toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-full mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 text-center text-xl font-bold text-gray-700">
        {currentMonth}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {daysOfWeek.map(day => (
          <div key={day} className="bg-white py-2 text-center font-bold text-gray-700">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-white h-24 p-2 ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}
          >
            <div>{new Date(day.date).getDate()}</div>
            {day.events && day.events.map(event => (
              <div key={event.id} className="mt-1 text-xs">
                <a href={event.href} className="text-blue-500">
                  {event.name} at {event.time}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
