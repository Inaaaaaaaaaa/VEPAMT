import React, { useState } from 'react';
import axios from 'axios';

const ReviewForm = ({ reviewId }) => {
  const [score, setScore] = useState(0);
  const [comments, setComments] = useState('');
  const [confidence, setConfidence] = useState(1);
  const [confidenceComments, setConfidenceComments] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // 成功消息
  const [errorMessage, setErrorMessage] = useState(''); // 错误消息

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedReview = {
      score,
      comments,
      confidenceScore: confidence,
      confidenceComments,
      status: 'Reviewed',
    };

    axios.put(`http://localhost:8080/api/reviews/${reviewId}`, updatedReview)
      .then((response) => {
        console.log('Review updated successfully:', response.data);
        setSuccessMessage('Submit successfully!'); // 设置成功消息
        setErrorMessage(''); // 清除错误消息
      })
      .catch((error) => {
        console.error('Error updating review:', error);
        setErrorMessage('Failed to update submit. Please try again.'); // 设置错误消息
        setSuccessMessage(''); // 清除成功消息
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-bold mb-4">Review Article</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Score (0-5):</label>
          <select
            value={score}
            onChange={(e) => setScore(parseInt(e.target.value))}
            className="w-full p-2 border rounded-lg"
          >
            <option value="0">0 - Issue, Cannot be Scored</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Comments:</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows="4"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your review comments..."
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Confidence (1-5):</label>
          <select
            value={confidence}
            onChange={(e) => setConfidence(parseInt(e.target.value))}
            className="w-full p-2 border rounded-lg"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Confidence Comments:</label>
          <textarea
            value={confidenceComments}
            onChange={(e) => setConfidenceComments(e.target.value)}
            rows="4"
            className="w-full p-2 border rounded-lg"
            placeholder="Enter your confidence comments..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Submit Review
        </button>
      </form>
      {/* 显示成功或错误消息 */}
      {successMessage && <p className="mt-4 text-green-600">{successMessage}</p>}
      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}
    </div>
  );
};

export default ReviewForm;
