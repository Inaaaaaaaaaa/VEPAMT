import React, { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import axios from 'axios';

function SubmissionDetailsCard4({ reviewId, status, reviewers, comments, finalDecision }) {
  const [reviewStatus, setReviewStatus] = useState(status);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // 使用 useEffect 监测父组件传入的 status 的变化
  useEffect(() => {
    setReviewStatus(status);
  }, [status]);

  const handleAcceptReview = () => setIsAcceptModalOpen(true);

  const handleConfirmAccept = () => {
    setIsAcceptModalOpen(false);

    // 调用 API 更新 reviewStatus
    axios.put(`http://localhost:8080/api/reviews/${reviewId}/status`, null, {
      params: { status: 'Approved' }
    })    
      .then(response => {
        setReviewStatus('Approved');
        console.log('Review status updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating review status:', error);
      });
  };

  const handleRejectReview = () => setIsRejectModalOpen(true);

  const handleConfirmReject = () => {
    console.log('Reviewer Rejected with reason:', rejectReason);
    setIsRejectModalOpen(false);
  };

  const renderContent = () => {
    switch (reviewStatus.toLowerCase()) {
      case 'pending':
        return (
          <div>
            <h4 className="text-lg font-semibold mb-4">Would you like to review this article?</h4>
            <button
              onClick={handleAcceptReview}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-4"
            >
              Accept
            </button>
            <button
              onClick={handleRejectReview}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Reject
            </button>

            {isAcceptModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-transparent">
                <div className="bg-white p-6 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Review Accepted</h3>
                  <p>You have accepted to review this article. Status is now "In Review".</p>
                  <button
                    onClick={handleConfirmAccept}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {isRejectModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center">
                <div className="bg-white p-6 rounded-md shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Reject Review</h3>
                  <p>Please provide a reason for rejecting the review:</p>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows="4"
                    className="w-full p-2 border rounded-md mt-2"
                    placeholder="Enter your reason..."
                  ></textarea>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setIsRejectModalOpen(false)}
                      className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmReject}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'approved':
        return (
          <div>
            <h4 className="text-lg font-semibold mb-2">You are reviewing this article.</h4>
            <ReviewForm reviewId={reviewId} />
          </div>
        );

      case 'reviewed':
        return (
          <div>
            <h4 className="text-lg font-semibold mb-2">Comments from Reviewer</h4>
            <div className="mb-6 border border-gray-200 p-4 rounded-md">
              <p><strong>Article Rating:</strong> {comments.articleRating} / 5</p>
              <p><strong>Comment:</strong> {comments.articleComment}</p>
              <p><strong>Confidence Level:</strong> {comments.confidenceRating} / 5</p>
              <p><strong>Confidence Comment:</strong> {comments.confidenceComment}</p>
            </div>

            {reviewStatus === 'completed' && (
              <div className="mt-6 border-t border-gray-300 pt-4">
                <p><strong>Final Decision:</strong> {finalDecision.pass ? 'Pass' : 'Not Pass'}</p>
                <p><strong>Note to Author:</strong> {finalDecision.noteToAuthor}</p>
              </div>
            )}
          </div>
        );

      default:
        return <p>You have Rejected to review this paper. {reviewStatus}</p>;
    }
  };

  return (
    <div className="col-span-4 bg-white p-6 rounded-md shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Information</h3>
      {renderContent()}
    </div>
  );
}

export default SubmissionDetailsCard4;
