package edu.aut_conference.backend.service.Reviewer;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.aut_conference.backend.model.Shared.Review;
import edu.aut_conference.backend.repository.Reviewer.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review findReviewById(Long reviewID) {
        return reviewRepository.findById(reviewID).orElse(null);
    }

    public Review updateReview(Long reviewID, Review updatedReview) {
        return reviewRepository.findById(reviewID).map(review -> {
            review.setUserId(updatedReview.getUserId());
            review.setScore(updatedReview.getScore());
            review.setComments(updatedReview.getComments());
            // 添加其他字段更新
            return reviewRepository.save(review);
        }).orElse(null);
    }

    public Long findReviewIdBySubmissionIdAndUserId(Long submissionId, Long userId) {
        return reviewRepository.findReviewIdBySubmissionIdAndUserId(submissionId, userId);
    }

    public void assignReviewer(Long submissionId, List<Long> reviewerIds) {
        for (Long reviewerId : reviewerIds) {
            Review review = new Review();
            review.setSubmissionId(submissionId);
            review.setUserId(reviewerId);
            review.setStatus("pending");
            saveReview(review);
        }
    }

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }
    
    public List<Review> findReviewsBySubmissionId(Long submissionId) {
        return reviewRepository.findBySubmissionId(submissionId);
    }
}
