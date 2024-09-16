package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.io.Serializable;

@Entity
@Table(name = "reviews")
public class Review {

    @EmbeddedId
    private ReviewId id;

    // Default Constructor
    public Review() {
    }

    // Constructor with ReviewId
    public Review(ReviewId id) {
        this.id = id;
    }

    // Getter and Setter for ReviewId
    public ReviewId getId() {
        return id;
    }

    public void setId(ReviewId id) {
        this.id = id;
    }

    // Composite Key
    @Embeddable
    public static class ReviewId implements Serializable {

        @Column(name = "user_id")
        private Long userId;

        @Column(name = "paper_id")
        private Long paperId;

        // Default Constructor
        public ReviewId() {
        }

        // Constructor with fields
        public ReviewId(Long userId, Long paperId) {
            this.userId = userId;
            this.paperId = paperId;
        }

        // Getters and Setters
        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public Long getPaperId() {
            return paperId;
        }

        public void setPaperId(Long paperId) {
            this.paperId = paperId;
        }

        // Override equals and hashCode for proper comparison in composite keys
        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;

            ReviewId reviewId = (ReviewId) o;

            if (!userId.equals(reviewId.userId)) return false;
            return paperId.equals(reviewId.paperId);
        }

        @Override
        public int hashCode() {
            int result = userId.hashCode();
            result = 31 * result + paperId.hashCode();
            return result;
        }
    }
}
