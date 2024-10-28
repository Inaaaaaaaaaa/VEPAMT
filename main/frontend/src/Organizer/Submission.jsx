import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubmissionCard from './Submission/SubmissionCard';

function Submission() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 使用 useEffect 获取提交数据
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // 发送 GET 请求到你的后端 API 端点
        const response = await axios.get('http://localhost:8080/api/submissions/cards');
        
        // 设置获取到的提交数据
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('An error occurred while fetching submissions.');
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="flex flex-col p-6 bg-blue-100 blue:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 black:text-slate-100 font-bold mb-6">Submission Management: </h1>
      <div className="grid grid-cols-12 gap-6">
        {loading ? (
          <p>Loading submissions...</p>
        ) : error ? (
          <p>{error}</p>
        ) : submissions.length > 0 ? (
          submissions.map(submission => (
            <SubmissionCard
              id={submission.submissionID}
              title={submission.title}
              author={submission.authors} // 确保后端返回的字段与这里匹配
              keywords={submission.keywords}
              submitDate={submission.submitDate}
              status={submission.status}
            />
          ))
        ) : (
          <p>No submissions available</p>
        )}
      </div>
    </div>
  );
}

export default Submission;
