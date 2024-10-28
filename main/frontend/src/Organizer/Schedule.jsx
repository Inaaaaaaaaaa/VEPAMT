import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SubmissionCard1 from './Schedule/SubmissionCard1';
import SubmissionCard2 from './Schedule/SubmissionCard2';
import SubmissionCard from './Submission/SubmissionCard';
import ConferenceCard from './Conference/ConferenceCard';

// 自定义 Hook 用于获取数据
function useDataFetching(url, initialState) {
  const [data, setData] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 1. Submission 组件
function Submission() {
  const [submissions, setSubmissions] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);  // 默认设置为 null
  const [waitingForAssign, setWaitingForAssign] = useState(0);
  const [assignedToday, setAssignedToday] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/submissions?page=0&size=200');
        const submissionsData = Array.isArray(response.data.submissions) ? response.data.submissions : [];
    
        // 获取作者信息并格式化日期
        const submissionsWithAuthors = await Promise.all(
          submissionsData.map(async (submission) => {
            let authorName = 'Unknown';
            let formattedDate = 'Unknown';
    
            // 获取作者名字
            if (submission.userID) {
              try {
                const userResponse = await axios.get(`http://localhost:8080/api/submissions/users/${submission.userID}`);
                const user = userResponse.data;
    
                // 拼接 first_name 和 last_name
                authorName = `${user.firstName} ${user.lastName}`;
              } catch (error) {
                console.error(`Error fetching author for userID ${submission.userID}:`, error);
              }
            }
    
            // 格式化 submitDate
            if (submission.submitDate) {
              formattedDate = new Date(submission.submitDate).toISOString().split('T')[0]; // 格式化为 'YYYY-MM-DD'
            }
    
            return {
              submissionID: submission.submissionID || 0,
              title: submission.title || 'No title',
              author: authorName,
              keywords: submission.keywords || '',
              submitDate: formattedDate,
              status: submission.status || 'Unknown',
            };
          })
        );
    
        setSubmissions(submissionsWithAuthors);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setSubmissions([]); // 确保在错误时设为空数组
      }
    };
    
  

    const fetchMonthlyStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/submissions/stats/monthly/submissions');
        setMonthlyData({
          labels: response.data.labels,
          datasets: [
            {
              
              data: response.data.data,
              fill: true,
              backgroundColor: 'rgba(0, 51, 102, 0.08)',
              borderColor: '#003366',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#003366',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching monthly stats:', error);
      }
    };

    const fetchDailyStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/submissions/stats/today/submissions');
        // 正确访问 response.data 中的 waitingForAssign 和 assignedToday
        setWaitingForAssign(response.data.waitingForAssign);
        setAssignedToday(response.data.assignedToday);
      } catch (error) {
        console.error('Error fetching daily stats:', error);
      }
    };
    

    fetchSubmissions();
    fetchMonthlyStats();
    fetchDailyStats();
  }, []);

  return (
    <div className="flex flex-col p-6 bg-blue-100 blue:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 black:text-slate-100 font-bold mb-6">Submission Management</h1>
      
      {/* 图表部分 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-full">
          {/* 如果 monthlyData 存在则渲染图表，否则显示加载信息 */}
          {monthlyData ? (
            <SubmissionCard1 title="Submission Growth" data={monthlyData} />
          ) : (
            <p>Loading monthly data...</p>
          )}
        </div>
        <div className="h-full">
          {/* 如果数据存在则渲染甜甜圈图，否则显示加载信息 */}
          {waitingForAssign !== null && assignedToday !== null ? (
            <SubmissionCard2 title="Reviewer Assignment Status" waitingForAssign={waitingForAssign} assignedToday={assignedToday} />
          ) : (
            <p>Loading daily stats...</p>
          )}
        </div>
      </div>

      {/* 卡片部分 */}
      <div className="grid grid-cols-12 gap-6">
  {submissions
    .filter((submission) => submission.status.toLowerCase() === 'unassigned')  // 只显示未分配的投稿
    .map((submission) => (
      <div key={submission.submissionID} className="col-span-full sm:col-span-6 xl:col-span-4">
        <SubmissionCard
          submissionid={submission.submissionID}
          title={submission.title}
          author={submission.author}
          keywords={submission.keywords}
          submitDate={submission.submitDate}
          status={submission.status}
          link={`/submission/${submission.submissionID}`}  // 动态生成链接
        />
      </div>
  ))}
</div>

    </div>
  );
}

// 3. Review 组件
function Review() {
  const [reviews, setReviews] = useState([]);  // 保存评审数据
  const [monthlyReviewData, setMonthlyReviewData] = useState(null);  // 月度评审数据
  const [waitingForReview, setWaitingForReview] = useState(0);  // 等待评审的数量
  const [pendingDecision, setPendingDecision] = useState(0);  // 今日待决策的数量

  useEffect(() => {
    // 获取已评审投稿数据
  
      const fetchReviews = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/submissions?page=0&size=200');
          const submissionsData = Array.isArray(response.data.submissions) ? response.data.submissions : [];
    
          // 获取作者名字并格式化日期
          const submissionsWithAuthors = await Promise.all(
            submissionsData.map(async (submission) => {
              let authorName = 'Unknown';
              let formattedDate = 'Unknown';
    
              // 获取作者名字
              if (submission.userID) {
                try {
                  const userResponse = await axios.get(`http://localhost:8080/api/submissions/users/${submission.userID}`);
                  const user = userResponse.data;
    
                  // 拼接 first_name 和 last_name
                  authorName = `${user.first_name} ${user.last_name}`;
                } catch (error) {
                  console.error(`Error fetching author for userID ${submission.userID}:`, error);
                }
              }
    
              // 格式化 submitDate
              if (submission.submitDate) {
                formattedDate = new Date(submission.submitDate).toISOString().split('T')[0]; // 格式化为 'YYYY-MM-DD'
              }
    
              return {
                submissionID: submission.submissionID || 0,
                title: submission.title || 'No title',
                author: authorName,
                keywords: submission.keywords || 'No keywords',
                submissionDate: formattedDate,
                status: submission.status || 'Unknown',
                link: submission.link || 'No link',
              };
            })
          );
    
          // 筛选出 'Reviewed' 状态的 submissions
          const reviewedSubmissions = submissionsWithAuthors.filter((review) => review.status.toLowerCase() === 'reviewed');
    
          setReviews(reviewedSubmissions);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setReviews([]); // 请求失败时设置为空数组
        }
      };
    
  
  
    
    

    // 获取月度评审统计数据
    const fetchMonthlyReviewStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/submissions/stats/monthly/reviews');
        setMonthlyReviewData({
          labels: response.data.labels,
          datasets: [
            {
              data: response.data.data,  // 月度数据
              fill: true,
              backgroundColor: 'rgba(0, 51, 102, 0.08)',
              borderColor: '#003366',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#003366',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching monthly review stats:', error);
      }
    };

    // 获取当天评审状态统计数据
    const fetchDailyReviewStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/submissions/stats/today/reviews');
        setWaitingForReview(response.data.waitingForReview);  // 设置等待评审的数据
        setPendingDecision(response.data.pendingDecision);  // 设置待决策的数据
      } catch (error) {
        console.error('Error fetching daily review stats:', error);
      }
    };

    fetchReviews();  // 执行数据获取
    fetchMonthlyReviewStats();  // 执行月度统计数据获取
    fetchDailyReviewStats();  // 执行每日统计数据获取
  }, []);

  return (
    <div className="flex flex-col p-6 bg-blue-100 blue:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 black:text-slate-100 font-bold mb-6">Review Management</h1>
      
      {/* 图表部分 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-full">
          {/* 如果 monthlyReviewData 存在则渲染图表，否则显示加载信息 */}
          {monthlyReviewData ? (
            <SubmissionCard1 title="Review Progress" data={monthlyReviewData} />
          ) : (
            <p>Loading monthly review data...</p>
          )}
        </div>
        <div className="h-full">
          {/* 如果数据存在则渲染甜甜圈图，否则显示加载信息 */}
          {waitingForReview !== null && pendingDecision !== null ? (
            <SubmissionCard2 title="Reviewer Decision Status" waitingForAssign={waitingForReview} assignedToday={pendingDecision} />
          ) : (
            <p>Loading daily stats...</p>
          )}
        </div>
      </div>

{/* Review 卡片部分 */}
<div className="grid grid-cols-12 gap-6">
  {reviews.length > 0 ? (
    reviews.map((review) => (
      <div key={review.submissionID} className="col-span-full sm:col-span-6 xl:col-span-4">
        <SubmissionCard
          submissionid={review.submissionID}
          title={review.title}
          author={review.author}
          keywords={review.keywords}
          submitDate={review.submissionDate}  // 确保使用 'submitDate' 而不是 'submissionDate'
          status={review.status}
          link={review.link}
        />
      </div>
    ))
  ) : (
    <p className="text-center col-span-full text-slate-500">No reviewed submissions available</p>
  )}
</div>


    </div>
  );

   
  
}


function Conference() {
  const { data: conferences, loading, error } = useDataFetching('http://localhost:8080/api/conferences', []);
  const [monthlyConferenceData, setMonthlyConferenceData] = useState(null); // 月度会议数据
  const [draftCount, setDraftCount] = useState(0);  // 草稿状态会议数量
  const [waitingCount, setWaitingCount] = useState(0);  // 等待状态会议数量

  // 获取月度会议统计数据
  const fetchMonthlyConferenceStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/conferences/stats/monthly');
      setMonthlyConferenceData({
        labels: response.data.labels,
        datasets: [
          {
            data: response.data.data,  // 月度数据
            fill: true,
            backgroundColor: 'rgba(0, 51, 102, 0.08)',
            borderColor: '#003366',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointBackgroundColor: '#003366',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching monthly conference stats:', error);
    }
  };

  // 获取当天会议状态统计数据
  const fetchDailyConferenceStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/conferences/stats/today');
      setDraftCount(response.data.draft);  // 草稿状态会议数量
      setWaitingCount(response.data.waiting);  // 等待状态会议数量
    } catch (error) {
      console.error('Error fetching daily conference stats:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyConferenceStats();  // 获取月度会议数据
    fetchDailyConferenceStats();  // 获取当天会议数据
  }, []);

  if (loading) return <p>Loading conferences...</p>;
  if (error) return <p>Error loading conferences!</p>;

  const activeConferences = conferences.filter((conference) => conference.status.toLowerCase() === 'waiting');
  const draftConferences = conferences.filter((conference) => conference.status.toLowerCase() === 'draft');

  return (
    <div className="flex flex-col p-6 bg-blue-100 blue:bg-slate-900 min-h-screen">
      <h1 className="text-2xl md:text-3xl text-slate-800 black:text-slate-100 font-bold mb-6">Conference Management</h1>
      
      {/* 图表部分 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-full">
          {/* 如果 monthlyConferenceData 存在则渲染图表 */}
          {monthlyConferenceData ? (
            <SubmissionCard1 title="Conference Progress" data={monthlyConferenceData} />
          ) : (
            <p>Loading monthly conference data...</p>
          )}
        </div>
        <div className="h-full">
          {/* 如果草稿和等待数据存在则渲染甜甜圈图 */}
          {draftCount !== null && waitingCount !== null ? (
            <SubmissionCard2 
              title="Today's Conferences Status" 
              waitingForAssign={waitingCount} 
              assignedToday={draftCount} 
            />
          ) : (
            <p>Loading daily stats...</p>
          )}
        </div>
      </div>
    </div>
  );
}


// Schedule 组件用于管理不同 Tab 的切换和渲染
function Schedule() {
  const [activeTab, setActiveTab] = useState('Submission');

  // 根据选中的 tab 渲染对应的组件
  const renderContent = () => {
    switch (activeTab) {
      case 'Submission':
        return <Submission />;
      case 'Review':
        return <Review />;
      case 'Conference':
        return <Conference />;
      default:
        return <Submission />;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Schedule</h1>

      {/* Tab 切换按钮 */}
      <div className="flex justify-center mb-6">
        <div className="flex flex-wrap -space-x-px w-1/2">
          <button
            className={`btn flex-1 text-center py-2 bg-indigo-500 first:rounded-l last:rounded-r first:border-l-transparent ${
              activeTab === 'Submission' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'
            }`}
            onClick={() => setActiveTab('Submission')}
          >
            Submission
          </button>
          <button
            className={`btn flex-1 text-center py-2 bg-indigo-500 first:rounded-l last:rounded-r first:border-l-transparent ${
              activeTab === 'Review' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'
            }`}
            onClick={() => setActiveTab('Review')}
          >
            Review
          </button>
          <button
            className={`btn flex-1 text-center py-2 bg-indigo-500 first:rounded-l last:rounded-r first:border-l-transparent ${
              activeTab === 'Conference' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border'
            }`}
            onClick={() => setActiveTab('Conference')}
          >
            Conference
          </button>
        </div>
      </div>

      {/* 根据当前选中的 Tab 渲染内容 */}
      <div className="mb-4">{renderContent()}</div>
    </div>
  );
}

export default Schedule;
