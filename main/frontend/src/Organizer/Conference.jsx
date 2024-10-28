import React, { useState, useEffect } from 'react';
import axios from 'axios'; // 用于发起 API 请求
import { Link } from 'react-router-dom'; 
import ConferenceCard from './Conference/ConferenceCard';

function Conference() {
  // 使用 useState 保存从后端获取的数据
  const [conferences, setConferences] = useState([]);

  // 使用 useEffect 来从后端加载数据
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        // 从后端 API 获取会议数据
        const response = await axios.get('http://localhost:8080/api/conferences');
        const conferencesData = response.data;

        // 遍历每个会议，获取与会议关联的用户（作者）信息
        const updatedConferences = await Promise.all(conferencesData.map(async (conference) => {
          // 获取与会议相关的用户（作者）信息
          const authorsResponse = await axios.get(`http://localhost:8080/api/conferences/${conference.conferenceID}/authors`);
          const authors = authorsResponse.data.map(author => `${author.firstName} ${author.lastName}`);
          return {
            ...conference,
            authors // 将获取到的作者信息存储到每个会议中
          };
        }));

        setConferences(updatedConferences); // 将更新后的会议数据存储到 state 中
      } catch (error) {
        console.error('Error fetching conferences:', error);
      }
    };

    fetchConferences();
  }, []); // 空数组作为依赖意味着只在组件初次渲染时执行一次

  return (
    <div className="flex flex-col p-6 bg-blue-100 blue:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 black:text-slate-100 font-bold mb-6">Conference Management</h1>
      <div className="mb-4">
        <Link
          to="/add-conference"
          className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="w-4 h-4 fill-current opacity-50 shrink-0 mr-2" viewBox="0 0 16 16">
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          Add Conference
        </Link>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {conferences.length > 0 ? (
          conferences.map((conference) => (
            <ConferenceCard
              key={conference.conferenceID}  // 确保 key 是唯一的
              id={conference.conferenceID}    // 传递 id 到 ConferenceCard
              title={conference.title}
              authors={conference.authors}    // 传递作者信息到 ConferenceCard
              date={conference.date}
              status={conference.status}
              link={conference.link}
            />
          ))
        ) : (
          <p>Loading conferences...</p>
        )}
      </div>
    </div>
  );
}

export default Conference;
