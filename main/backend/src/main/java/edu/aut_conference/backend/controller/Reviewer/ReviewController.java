package edu.aut_conference.backend.controller.Reviewer;

// 导入注解
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import edu.aut_conference.backend.model.Author.Submission;
import edu.aut_conference.backend.model.Shared.Review;
import edu.aut_conference.backend.repository.Reviewer.ReviewRepository;
import edu.aut_conference.backend.service.Author.SubmissionService;
import edu.aut_conference.backend.service.Reviewer.ReviewService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping("/findReviewId")
    public ResponseEntity<Long> getReviewIdBySubmissionIdAndUserId(
            @RequestParam Long submissionId, @RequestParam Long userId) {
        Long reviewId = reviewService.findReviewIdBySubmissionIdAndUserId(submissionId, userId);
        if (reviewId == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reviewId);
    }

    @GetMapping("/{reviewID}")
    public ResponseEntity<Review> getReview(@PathVariable Long reviewID) {
        Review review = reviewService.findReviewById(reviewID);
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(review);
    }

    @PutMapping("/{reviewID}")
    public ResponseEntity<Review> updateReview(@PathVariable Long reviewID, @RequestBody Review updatedReview) {
        return reviewRepository.findById(reviewID).map(review -> {
            review.setStatus("Reviewed");
            review.setScore(updatedReview.getScore());
            review.setComments(updatedReview.getComments());
            review.setConfidenceScore(updatedReview.getConfidenceScore());
            review.setConfidenceComments(updatedReview.getConfidenceComments());

            // 设置新西兰时间格式的日期
            LocalDateTime nowNZ = LocalDateTime.now(ZoneId.of("Pacific/Auckland"));
            review.setReviewDate(nowNZ);

            return ResponseEntity.ok(reviewRepository.save(review));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{reviewID}/status")
    public ResponseEntity<Review> updateReviewStatus(@PathVariable Long reviewID, @RequestParam String status) {
        return reviewRepository.findById(reviewID).map(review -> {
            review.setStatus(status); // 更新 status 字段
            return ResponseEntity.ok(reviewRepository.save(review));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignReviewers(@RequestParam Long submissionId,
            @RequestBody List<Long> reviewerIds) {
        try {
            // 更新 submission 表中的状态为 'assigned'
            Optional<Submission> optionalSubmission = submissionService.findById(submissionId);
            if (optionalSubmission.isPresent()) {
                Submission submission = optionalSubmission.get();
                submission.setStatus("assigned");
                submissionService.save(submission);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Submission not found.");
            }

            // 为每个 reviewerId 创建一个新的 review 记录，并设置 status 为 'pending'
            for (Long reviewerId : reviewerIds) {
                Review review = new Review();
                review.setSubmissionId(submissionId); // 设置 submissionId
                review.setUserId(reviewerId); // 将 reviewerId 设置为 userId
                review.setStatus("pending"); // 设置状态为 'pending'
                reviewService.saveReview(review);
            }

            return ResponseEntity.ok("Reviewers assigned successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error assigning reviewers.");
        }
    }

    // 根据 submissionId 获取所有的 review
    @GetMapping("/submission/{submissionId}")
    public ResponseEntity<List<Review>> getReviewsBySubmissionId(@PathVariable Long submissionId) {
        List<Review> reviews = reviewService.findReviewsBySubmissionId(submissionId);
        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reviews);
    }

}
