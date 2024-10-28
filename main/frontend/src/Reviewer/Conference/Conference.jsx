import React, { useEffect, useState } from 'react';
import ConferenceBox from './ConferenceBox';
import { fetchConferencesByUser } from '../../api';  // 调用与用户相关的 API
import { useLocation, useParams } from 'react-router-dom';

function Conference() {
  const [conferences, setConferences] = useState([]);
  const location = useLocation();
  const { userID } = useParams();  // 从 URL 参数中获取用户 ID
  const keyword = new URLSearchParams(location.search).get('keyword');

  useEffect(() => {
    const getConferences = async () => {
      try {
        // 调用 API 获取与当前用户相关的会议
        const data = await fetchConferencesByUser(userID);

        // 确保 participants 是一个数组
        const processedData = data.map(conf => ({
          ...conf,
          participants: Array.isArray(conf.participants) ? conf.participants : [],
        }));

        // 过滤掉状态为 'Draft' 的会议
        const relevantConferences = processedData.filter(conf => conf.status !== 'Draft');

        // 如果有搜索关键字，则进一步过滤
        if (keyword && keyword.trim() !== '') {
          const filteredConferences = relevantConferences.filter(conf =>
            conf.title.toLowerCase().includes(keyword.trim().toLowerCase())
          );
          setConferences(filteredConferences);
        } else {
          setConferences(relevantConferences);
        }
      } catch (error) {
        console.error('Error fetching conferences:', error);
        setConferences([]);
      }
    };

    getConferences();
  }, [keyword, userID]);

  return (
    <div>
      <h1>Conferences</h1>
      {keyword && (
        <p>Showing results for: <strong>{keyword}</strong></p>
      )}
      <div>
        {conferences.length > 0 ? (
          conferences.map((conf) => (
            <ConferenceBox key={conf.conferenceID} conference={conf} />
          ))
        ) : (
          <p>No conferences found.</p>
        )}
      </div>
    </div>
  );
}

export default Conference;


