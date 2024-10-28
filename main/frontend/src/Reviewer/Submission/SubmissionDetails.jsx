import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SubmissionDetailCard1 from './SubmissionDetailsCard1';
import SubmissionDetailsCard2 from './SubmissionDetailsCard2';
import SubmissionDetailsCard3 from './SubmissionDetailsCard3';
import SubmissionDetailsCard4 from './SubmissionDetailsCard4';

export default function SubmissionDetails() {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [review, setReview] = useState(null);
  const [reviewId, setReviewId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Helper function to get a value from cookies
  function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Get userID and role from cookies
  const currentUserId = getCookieValue('userID');
    
    axios.get(`http://localhost:8080/api/submissions/${id}`)
      .then((response) => {
        setSubmission(response.data);
        return axios.get(`http://localhost:8080/api/reviews/findReviewId?submissionId=${id}&userId=${currentUserId}`);
      })
      .then((response) => {
        const fetchedReviewId = response.data;
        setReviewId(fetchedReviewId);
        return axios.get(`http://localhost:8080/api/reviews/${fetchedReviewId}`);
      })
      .then((response) => {
        setReview(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, [id]);
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!submission) {
    return <p>Submission not found.</p>;
  }

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
      size: (file.size / 1024).toFixed(2) + ' KB'
    })),
    authors: submission.authors.map(author => ({
      name: `${author.firstName} ${author.lastName}`,
      email: author.email
    })),
    comments: {
      articleRating: review ? review.score : null,
      articleComment: review ? review.comments : '',
      confidenceRating: review ? review.confidenceScore : null,
      confidenceComment: review ? review.confidenceComments : ''
    },
    finalDecision: {
      pass: true,  
      noteToAuthor: 'The paper has been accepted with minor revisions.'
    }
  };

  // 验证 review 和 status
  console.log("Review object:", review);
  console.log("Review status:", review?.status);

  return (
    <div className="p-4 space-y-6">
      <SubmissionDetailCard1 submission={formattedSubmission} />

      <div className="grid grid-cols-4 gap-6">
        <SubmissionDetailsCard2 attachments={formattedSubmission.attachments} />
        <SubmissionDetailsCard3 authors={formattedSubmission.authors} />
      </div>

      {/* 确保 status 正确传递给 SubmissionDetailsCard4 */}
      {review && (
        <SubmissionDetailsCard4
          reviewId={reviewId}
          status={review.status}
          reviewers={formattedSubmission.authors}
          comments={formattedSubmission.comments}
          finalDecision={formattedSubmission.finalDecision}
        />
      )}
    </div>
  );
}
