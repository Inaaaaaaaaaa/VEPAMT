package edu.aut_conference.backend.model.Shared;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "FinalDecision")
public class FinalDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "decisionID")
    private Long id;

    @Column(name = "submissionID", nullable = false)
    private Long submissionId;

    @Column(name = "userID", nullable = false)
    private Long userId;

    @Column(name = "decision", nullable = false, length = 255)
    private String decision;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "commentTime", nullable = false)
    private LocalDateTime commentTime;

    // Constructors
    public FinalDecision() {
    }

    public FinalDecision(Long submissionId, Long userId, String decision, String comment, LocalDateTime commentTime) {
        this.submissionId = submissionId;
        this.userId = userId;
        this.decision = decision;
        this.comment = comment;
        this.commentTime = commentTime;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCommentTime() {
        return commentTime;
    }

    public void setCommentTime(LocalDateTime commentTime) {
        this.commentTime = commentTime;
    }
}
