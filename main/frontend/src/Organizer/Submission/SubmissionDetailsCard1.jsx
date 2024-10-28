import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

// 定义 SubmissionDetailCard1 组件
function SubmissionDetailCard1({ submission }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);  // 管理分配审稿人弹窗
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false); // 管理最终决策弹窗
  const [finalDecision, setFinalDecision] = useState('');  // 最终决策的选项
  const [comment, setComment] = useState('');  // 最终决策的注释
  const [selectedReviewers, setSelectedReviewers] = useState([]);  // 用于存储已选审稿人
  const [availableReviewers, setAvailableReviewers] = useState([]);  // 存储审稿人列表
  const [error, setError] = useState('');

  // 获取审稿人列表
  useEffect(() => {
    const fetchReviewers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users/reviewers');
        const reviewerOptions = response.data.map(user => ({
          value: user.id,
          label: `${user.firstName} ${user.lastName}`
        }));
        setAvailableReviewers(reviewerOptions);
      } catch (error) {
        console.error('Error fetching reviewers:', error);
        setError('Failed to load reviewers. Please try again.');
      }
    };

    fetchReviewers();
  }, []);

  // 打开和关闭分配审稿人弹窗
  const openAssignModal = () => setIsAssignModalOpen(true);
  const closeAssignModal = () => setIsAssignModalOpen(false);

  // 打开和关闭最终决策弹窗
  const openDecisionModal = () => setIsDecisionModalOpen(true);
  const closeDecisionModal = () => setIsDecisionModalOpen(false);

  // 处理审稿人选择
  const handleReviewerSelect = (selectedOption) => {
    setSelectedReviewers(selectedOption);
  };

  // 提交审稿人分配
// 提交审稿人分配
const handleAssignSubmit = async () => {
  if (selectedReviewers.length === 0) {
    setError('Please select at least one reviewer.');
    return;
  }

  try {
    // 将选中的审稿人 ID 提取为一个数组
    const reviewerIds = selectedReviewers.map(reviewer => reviewer.value);

    // 调用后端 API 分配审稿人
    const response = await axios.post('http://localhost:8080/api/reviews/assign', reviewerIds, {
      params: {
        submissionId: submission.id, // 假设 submission 对象有 ID
      },
      headers: {
        'Content-Type': 'application/json', // 确保请求类型为 JSON
      },
    });

    if (response.status === 200) {
      console.log('Reviewers assigned successfully.');
      // 在成功分配后，可以在这里更新状态为 'pending'
      submission.status = 'pending';
    } else {
      console.error('Failed to assign reviewers:', response.data);
      setError('Failed to assign reviewers. Please try again.');
    }
  } catch (error) {
    console.error('Error assigning reviewers:', error);
    setError('Error assigning reviewers. Please try again.');
  }

  closeAssignModal();
};


  // 提交最终决策
  const handleFinalDecisionSubmit = () => {
    console.log('Final Decision:', finalDecision);
    console.log('Comment:', comment);
    closeDecisionModal();
  };

  // 根据 submission 的状态渲染不同的内容
  const renderStatusActions = (status) => {
    switch (status.toLowerCase()) {
      case 'unassigned':
        return (
          <>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={openAssignModal}
            >
              Assign Reviewer
            </button>

            {/* Assign Reviewer Modal */}
            {isAssignModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Assign Reviewers</h3>

                  {/* 错误信息 */}
                  {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                      {error}
                    </div>
                  )}

                  {/* 审稿人选择 */}
                  <div>
                    <label htmlFor="reviewers" className="block text-sm font-medium text-gray-700">Select Reviewers</label>
                    <Select
                      id="reviewers"
                      options={availableReviewers}  // 获取的审稿人列表
                      isMulti  // 允许多选
                      onChange={handleReviewerSelect}  // 处理用户选择
                      value={selectedReviewers}  // 当前选中的审稿人
                    />
                  </div>

                  {/* 提交按钮 */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={closeAssignModal}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignSubmit}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        );
      case 'reviewed':
        return <p className="text-yellow-600">Waiting for marks.</p>;
      case 'assigned':
        return <p className="text-yellow-600">Waiting for reviewer to accept.</p>;
      case 'in review':
        return <p className="text-green-600">Reviewer has accepted to review.</p>;
      case 'completed':
        return <p className="text-purple-600">The submission process is completed.</p>;
      default:
        return <p className="text-gray-500">Status unknown.</p>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md mb-6">
      <h2 className="text-2xl font-semibold mb-2">{submission.title}</h2>
      <p className="text-gray-600 mb-4"><strong>Keywords:</strong> {submission.keywords}</p>
      <p className="text-gray-600 mb-4"><strong>Track:</strong> {submission.track}</p>
      <p className="text-gray-600 mb-4"><strong>Abstract:</strong> {submission.abstract}</p>
      <p className="text-gray-600 mb-4"><strong>Status:</strong> {submission.status}</p>

      {/* 根据状态显示不同的按钮或信息 */}
      <div className="mt-4">
        {renderStatusActions(submission.status)}
      </div>
    </div>
  );
}

export default SubmissionDetailCard1;
