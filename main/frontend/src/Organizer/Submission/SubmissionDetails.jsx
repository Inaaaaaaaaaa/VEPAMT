import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SubmissionDetailCard1 from './SubmissionDetailsCard1';
import SubmissionDetailsCard2 from './SubmissionDetailsCard2';
import SubmissionDetailsCard3 from './SubmissionDetailsCard3';
import SubmissionDetailsCard4 from './SubmissionDetailsCard4'; // 新引入 Card4

export default function SubmissionDetails() {
  // 用于存储从后端获取的submission数据的状态
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // Helper function to get a value from cookies
    function getCookieValue(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }
  
    // Get userID and role from cookies
    const userId = getCookieValue('userID');

  // Fetch submission data when the component mounts
  useEffect(() => {
    const fetchSubmission = async (id) => {
      try {
        const response = await fetch(`http://localhost:8080/api/submissions/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching submission: ${response.statusText}`);
        }

        const data = await response.json();
        setSubmission(data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    // 调用该函数并传入相应的 ID
    fetchSubmission(id);
  }, []);

  // Loading and error handling
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // 如果submission为null，则不渲染组件
  if (!submission) {
    return <div>No data available</div>;
  }

  // 提取前端需要的数据格式
  const formattedSubmission = {
    id: submission.submissionID,
    title: submission.title,
    keywords: submission.keywordsAsList.join(', '),
    submissionDate: submission.submitDate,
    status: submission.status,
    track: submission.track,
    abstract: submission.abstractText,
    attachments: submission.files.map(file => ({
      name: file.fileName,
      size: (file.size / 1024).toFixed(2) + ' KB', // 转换文件大小为 KB 格式
    })),
    authors: submission.authors.map(author => ({
      name: `${author.firstName} ${author.lastName}`,
      email: author.email,
    })),
    finalDecision: {
      pass: true, // 根据业务逻辑，可以根据后端数据动态更新
      noteToAuthor: 'The paper has been accepted with minor revisions.',
    },
  };

  return (
    <div className="p-4 space-y-6">
      {/* 渲染 SubmissionDetailCard1 */}
      <SubmissionDetailCard1 submission={formattedSubmission} />

      {/* 渲染附件和作者信息 */}
      <div className="grid grid-cols-4 gap-6">
        <SubmissionDetailsCard2 attachments={formattedSubmission.attachments} />
        <SubmissionDetailsCard3 authors={formattedSubmission.authors} />
      </div>

      {/* 渲染 SubmissionDetailsCard4 */}
      <SubmissionDetailsCard4
        status={formattedSubmission.status}
        submissionId={formattedSubmission.id}
        currentUserId={userId}
      />
    </div>
  );
}
