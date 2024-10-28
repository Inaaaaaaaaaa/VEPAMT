package edu.aut_conference.backend.model.Shared;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

import edu.aut_conference.backend.model.Author.Submission;
import edu.aut_conference.backend.model.UserLogin.User;

@Entity
@Table(name = "Review")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ReviewID")
    private Long reviewId;

    @Column(name = "userID", nullable = false)
    private Long userId;

    @Column(name = "submissionID", nullable = false)
    private Long submissionId; // 更改类型为 Long

    @Column(name = "ReviewDate")
    private LocalDateTime reviewDate;

    @Min(0)
    @Max(5)
    @Column(name = "Score")
    private Integer score;

    @Column(name = "Comments", columnDefinition = "TEXT")
    private String comments;

    @Min(1)
    @Max(5)
    @Column(name = "ConfidenceScore")
    private Integer confidenceScore;

    @Column(name = "ConfidenceComments", columnDefinition = "TEXT")
    private String confidenceComments;

    @Column(name = "Status", length = 255)
    private String status;

    // Many-to-One relationship with User, referencing "id" as foreign key
    @ManyToOne
    @JoinColumn(name = "userID", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;

    // Many-to-One relationship with Submission, referencing "submissionID" as foreign key
    @ManyToOne
    @JoinColumn(name = "submissionID", referencedColumnName = "submissionID", insertable = false, updatable = false)
    private Submission submission;

    // Getters and Setters
    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getSubmissionId() { // 更新类型
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) { // 更新类型
        this.submissionId = submissionId;
    }

    public LocalDateTime getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public Integer getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Integer confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public String getConfidenceComments() {
        return confidenceComments;
    }

    public void setConfidenceComments(String confidenceComments) {
        this.confidenceComments = confidenceComments;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }
}
