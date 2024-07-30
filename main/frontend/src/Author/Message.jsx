// Message.js
import React from 'react';
import MessageBox from './MessageBox';

function Message() {
  // 定义一些模拟的消息数据
  const messages = [
    { type: 'submission', title: 'Submission Received', content: 'Your paper submission has been received.', timestamp: '2024-07-25T08:00:00Z' },
    { type: 'conference', title: 'Conference Schedule', content: 'The conference schedule has been updated.', timestamp: '2024-07-24T14:00:00Z' },
    { type: 'other', title: 'System Maintenance', content: 'The system will be down for maintenance at midnight.', timestamp: '2024-07-24T22:00:00Z' },
    // 可以添加更多消息
  ];

  return (
    <div>
      <h1>Message</h1>
      <p>Welcome to the Message page!</p>
      <div>
        {messages.map((msg, index) => (
          <MessageBox key={index} message={msg} />
        ))}
      </div>
    </div>
  );
}

export default Message;