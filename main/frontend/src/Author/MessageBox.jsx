// MessageBox.js
import React from 'react';

function MessageBox({ message }) {
  // 根据消息类型设置竖线颜色
  const getLineColor = (type) => {
    switch (type) {
      case 'submission':
        return 'bg-blue-500';
      case 'conference':
        return 'bg-green-500';
      case 'other':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 计算几小时之前
  const calculateHoursAgo = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMilliseconds = now - messageTime;
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    return diffInHours;
  };

  return (
    <div className="flex items-stretch p-4 mb-2 border border-gray-300 rounded-md shadow-sm bg-white">
      <div className={`w-2 ${getLineColor(message.type)}`}></div>
      <div className="ml-4 flex-1">
        <h2 className="font-bold text-lg mb-2">{message.title}</h2>
        <p>{message.content}</p>
        <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()} ({calculateHoursAgo(message.timestamp)} hours ago)</p>
      </div>
    </div>
  );
}

export default MessageBox;