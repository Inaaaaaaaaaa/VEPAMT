import React, { useState, useEffect } from 'react';

function SubmissionDetailsCard4({ submissionId, status, currentUserId }) {
  // 定义组件状态
  const [reviews, setReviews] = useState([]); // 确保变量名是 'reviews'
  const [loading, setLoading] = useState(true);
  const [reviewers, setReviewers] = useState({});
  const [finalDecision, setFinalDecision] = useState(null);
  const [finalComment, setFinalComment] = useState('');
  const [storedFinalDecision, setStoredFinalDecision] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(true);

  useEffect(() => {
    // Fetch reviews and final decision by submissionId from the backend
    const fetchDetails = async () => {
      try {
        // Fetch reviews
        const reviewResponse = await fetch(`http://localhost:8080/api/reviews/submission/${submissionId}`);
        if (reviewResponse.ok) {
          const reviewData = await reviewResponse.json();
          setReviews(reviewData);

          // 从 reviews 中获取所有 unique 的 userIds
          const userIds = [...new Set(reviewData.map(review => review.userId))];

          // Fetch reviewer information by userIds
          const usersResponse = await fetch(`http://localhost:8080/api/users/batch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userIds),
          });

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const usersMap = {};
            usersData.forEach(user => {
              usersMap[user.id] = user;
            });
            setReviewers(usersMap);
          } else {
            console.error('Failed to fetch user information');
          }
        } else {
          console.error('Failed to fetch reviews');
        }

        // Fetch final decision
        const decisionResponse = await fetch(`http://localhost:8080/api/final-decisions/submission/${submissionId}`);
        if (decisionResponse.ok) {
          const decisionData = await decisionResponse.json();
          if (decisionData.length > 0) {
            // Assuming there's only one final decision per submission
            setStoredFinalDecision(decisionData[0]);
          }
        } else {
          console.error('Failed to fetch final decision');
        }
      } catch (error) {
        console.error('Error fetching details:', error);
      } finally {
        setLoading(false);
        setDecisionLoading(false);
      }
    };

    fetchDetails();
  }, [submissionId]);

  const handleAcceptArticle = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/final-decisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          userId: currentUserId,
          decision: 'Accept',
          comment: finalComment,
          decisionTime: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('Article accepted successfully!');
        // Update the UI to reflect the stored decision
        const newDecision = await response.json();
        setStoredFinalDecision(newDecision);
      } else {
        console.error('Failed to accept the article');
      }
    } catch (error) {
      console.error('Error accepting article:', error);
    }
  };

  const handleRejectArticle = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/final-decisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          userId: currentUserId,
          decision: 'Reject',
          comment: finalComment,
          decisionTime: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        alert('Article rejected successfully!');
        // Update the UI to reflect the stored decision
        const newDecision = await response.json();
        setStoredFinalDecision(newDecision);
      } else {
        console.error('Failed to reject the article');
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
    }
  };

    // 渲染每个 review 的内容
    const renderReviewContent = (review) => {
      const reviewer = reviewers[review.userId] || {};

      switch (review.status.toLowerCase()) {
        case 'pending':
          return (
            <div className="mb-4" key={review.reviewId}>
              <p><strong>Name:</strong> {`${reviewer.firstName || ''} ${reviewer.lastName || ''}`}</p>
              <p><strong>Email:</strong> <a href={`mailto:${reviewer.email || ''}`} className="text-indigo-600 hover:text-indigo-500">{reviewer.email || 'N/A'}</a></p>
              <p><strong>Status:</strong> Waiting for reviewer to accept the review</p>
            </div>
          );

        case 'accepted':
          return (
            <div className="mb-4" key={review.reviewId}>
              <p><strong>Name:</strong> {`${reviewer.firstName || ''} ${reviewer.lastName || ''}`}</p>
              <p><strong>Email:</strong> <a href={`mailto:${reviewer.email || ''}`} className="text-indigo-600 hover:text-indigo-500">{reviewer.email || 'N/A'}</a></p>
              <p><strong>Status:</strong> Reviewer accepted to review the article</p>
            </div>
          );

        case 'rejected':
          return (
            <div className="mb-4" key={review.reviewId}>
              <p><strong>Name:</strong> {`${reviewer.firstName || ''} ${reviewer.lastName || ''}`}</p>
              <p><strong>Email:</strong> <a href={`mailto:${reviewer.email || ''}`} className="text-indigo-600 hover:text-indigo-500">{reviewer.email || 'N/A'}</a></p>
              <p><strong>Status:</strong> Reviewer rejected the review request</p>
            </div>
          );

        case 'reviewed':
          return (
            <div className="mb-6 border border-gray-200 p-4 rounded-md" key={review.reviewId}>
              <p><strong>Name:</strong> {`${reviewer.firstName || ''} ${reviewer.lastName || ''}`}</p>
              <p><strong>Email:</strong> <a href={`mailto:${reviewer.email || ''}`} className="text-indigo-600 hover:text-indigo-500">{reviewer.email || 'N/A'}</a></p>
              <p><strong>Status:</strong> Review completed</p>
              <p><strong>Score:</strong> {review.score} / 5</p>
              <p><strong>Comment:</strong> {review.comments}</p>
              <p><strong>Confidence Level:</strong> {review.confidenceScore} / 5</p>
              <p><strong>Confidence Comment:</strong> {review.confidenceComments}</p>
            </div>
          );

        default:
          return <p>Status not recognized</p>;
      }
    };

    if (loading || decisionLoading) {
      return <p>Loading reviews and final decision...</p>;
    }

    return (
      <div className="col-span-4 bg-white p-6 rounded-md shadow-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Information </h3>

        {status.toLowerCase() === 'unassigned' ? (
          <p className="text-red-500">Please Assign reviewer</p>
        ) : (
          reviews.length > 0 ? (
            reviews.map(review => renderReviewContent(review))
          ) : (
            <p>No reviews available for this submission.</p>
          )
        )}

        {storedFinalDecision ? (
          <div className="mt-6 border-t border-gray-300 pt-4">
            <h4 className="text-lg font-semibold mb-2">Final Decision</h4>
            <p><strong>Decision:</strong> {storedFinalDecision.decision}</p>
            <p><strong>Final Comment:</strong> {storedFinalDecision.comment}</p>
            <p><strong>Comment Time:</strong> {new Date(storedFinalDecision.commentTime).toLocaleString()}</p>
          </div>
        ) : (
          <p>No final decision available for this submission.</p>
        )}

        {!storedFinalDecision && reviews.some(review => review.status.toLowerCase() === 'reviewed') && status.toLowerCase() !== 'completed' && (
          <div className="mt-6 border-t border-gray-300 pt-4">
            <h4 className="text-lg font-semibold mb-2">Make Final Decision</h4>
            <button
              onClick={handleAcceptArticle}
              className="mr-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Accept Article
            </button>
            <button
              onClick={handleRejectArticle}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Reject Article
            </button>
            <div className="mt-4">
              <label>
                <strong>Final Comment:</strong>
                <textarea
                  value={finalComment}
                  onChange={(e) => setFinalComment(e.target.value)}
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                  placeholder="Enter your final comment here"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    );
  }

  export default SubmissionDetailsCard4;
