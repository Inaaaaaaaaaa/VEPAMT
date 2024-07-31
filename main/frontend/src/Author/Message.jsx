import React, { useEffect, useState } from 'react';
import MessageBox from './MessageBox';
import { fetchMessages } from '../api'; // 引入API调用

function Message() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const data = await fetchMessages();
        console.log(data); // 在控制台打印数据
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    getMessages();
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <MessageBox message={message} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Message;
