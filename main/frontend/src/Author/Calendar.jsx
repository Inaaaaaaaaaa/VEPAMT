// Calendar.js
import { useState } from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';

export default function Calendar() {
  const [view, setView] = useState('month'); // Initialize with 'month' view

  const renderView = () => {
    switch (view) {
      case 'month':
        return <MonthView />;
      case 'week':
        return <WeekView />;
      default:
        return <MonthView />;
    }
  };

  return (
    <div>
      <div className="flex justify-end space-x-4 p-4">
        <button
          onClick={() => setView('month')}
          className={`px-4 py-2 rounded ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Month View
        </button>
        <button
          onClick={() => setView('week')}
          className={`px-4 py-2 rounded ${view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Week View
        </button>
      </div>
      {renderView()}
    </div>
  );
}
