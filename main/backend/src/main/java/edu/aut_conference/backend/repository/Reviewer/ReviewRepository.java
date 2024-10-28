package edu.aut_conference.backend.repository.Reviewer;

import edu.aut_conference.backend.model.Shared.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends CrudRepository<Review, Long> {

    @Query("SELECT r.submissionId FROM Review r WHERE r.userId = :userId")
    List<Long> findSubmissionIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT r.reviewId FROM Review r WHERE r.submissionId = :submissionId AND r.userId = :userId")
    Long findReviewIdBySubmissionIdAndUserId(@Param("submissionId") Long submissionId, @Param("userId") Long userId);

    @Query("SELECT r.submissionId FROM Review r WHERE r.userId = :userId AND r.status = 'Reviewed'")
    List<Long> findReviewedSubmissionIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT r.submissionId FROM Review r WHERE r.userId = :userId AND (r.status = 'pending' OR r.status = 'approved')")
    List<Long> findPendingAndApprovedSubmissionIdsByUserId(@Param("userId") Long userId);

    // 自定义查询方法，根据 submissionId 查找所有 review
    List<Review> findBySubmissionId(Long submissionId);

}
