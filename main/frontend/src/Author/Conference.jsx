// Conference.js
import React from 'react';
import ConferenceBox from './ConferenceBox';

function Conference() {
  // 定义一些模拟的会议数据
  const conferences = [
    {
      title: 'AI and Machine Learning Conference',
      date: '2024-08-15',
      location: 'New York City, NY',
      participants: ['Alice', 'Bob', 'Charlie'],
    },
    {
      title: 'Web Development Summit',
      date: '2024-09-10',
      location: 'San Francisco, CA',
      participants: ['Dave', 'Eve', 'Frank'],
    },
    {
      title: 'Cybersecurity Workshop',
      date: '2024-10-20',
      location: 'Los Angeles, CA',
      participants: ['Grace', 'Hank', 'Isaac'],
    },
    // 可以添加更多会议
  ];

  return (
    <div>
      <h1>Conferences</h1>
      <p>Welcome to the Conference page!</p>
      <div>
        {conferences.map((conf, index) => (
          <ConferenceBox key={index} conference={conf} />
        ))}
      </div>
    </div>
  );
}

export default Conference;
