import React, { useState, useEffect } from 'react';
import MessageCard from './Message/MessageCard';
import axios from 'axios';

function Message() {
  // 使用 state 来管理消息数据
  const [messages, setMessages] = useState([]);

  // Helper function to get a value from cookies
  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Get userID and role from cookies
  const userID = getCookieValue('userID');
  const role = getCookieValue('userType');

  // Log values to verify
  console.log('userID:', userID);
  console.log('role:', role);

  const token = localStorage.getItem('token'); // 如果使用 token 认证

  // 当组件加载时，向后端获取消息
  useEffect(() => {
    if (userID && role) {
      // 发起后端请求获取消息
      axios.get('http://localhost:8080/api/organizer/messages', {
        params: { userID, role },
      })
        .then(response => {
          // 更新 messages 状态
          setMessages(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch messages:", error);
        });
    }
  }, [userID, role, token]);

  return (
    <div className="flex flex-col p-6 bg-blue-100 blue:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 black:text-slate-100 font-bold mb-6">Message Management</h1>
      {/* <h1 className="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold mb-6">Message Management - UserID: {userID}, Role: {role}</h1> */}
      <div className="grid grid-cols-12 gap-6">
        {
          messages.length > 0 ? (
            messages.map(message => (
              <div key={message.id} className="col-span-full sm:col-span-6 xl:col-span-4">
                <MessageCard
                  title={message.title}
                  author={message.author}
                  time={message.time}
                  content={message.content}
                  type={message.type}
                />
              </div>
            ))
          ) : (
            <p className="col-span-12 text-center text-gray-500">No messages to display</p>
          )
        }
      </div>
    </div>
  );
}

export default Message;