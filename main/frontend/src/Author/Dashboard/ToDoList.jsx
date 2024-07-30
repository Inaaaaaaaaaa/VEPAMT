// ToDoList.js
import React from 'react';
import { Link } from 'react-router-dom';

const tasks = [
  {
    time: '10:00 AM',
    title: 'Paper Submission',
    dueDay: '2024-08-01',
    remainingTime: '7 days',
  },
  {
    time: '11:30 AM',
    title: 'Paper Review',
    dueDay: '2024-08-03',
    remainingTime: '9 days',
  },
  {
    time: '2:00 PM',
    title: 'Conference Scheduling',
    dueDay: '2024-08-05',
    remainingTime: '11 days',
  },
  {
    time: '4:00 PM',
    title: 'Final Review',
    dueDay: '2024-08-07',
    remainingTime: '13 days',
  },
];

function getColorForTitle(title) {
  switch (title) {
    case 'Paper Submission':
      return 'bg-blue-500';
    case 'Paper Review':
      return 'bg-green-500';
    case 'Conference Scheduling':
      return 'bg-red-500';
    case 'Final Review':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}

function ToDoList() {
  return (
    <div className="w-full max-w-[20rem] bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">To Do Tasks</h2>
        <Link to="/all-tasks" className="text-blue-500 hover:underline">View All</Link>
      </div>
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex-1">
                <div className="text-sm text-gray-600">Time: {task.time}</div>
                <div className="text-lg font-semibold">{task.title}</div>
                <div className="text-sm text-gray-600">Due Day: {task.dueDay}</div>
                <div className="text-sm text-gray-600">Remaining Time: {task.remainingTime}</div>
              </div>
              <div className={`h-12 w-1 rounded ${getColorForTitle(task.title)}`}></div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No Task</div>
        )}
      </div>
    </div>
  );
}

export default ToDoList;
