package edu.aut_conference.backend.repository.Author;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;

import edu.aut_conference.backend.model.Author.Submission;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    @Query("SELECT s FROM Submission s LEFT JOIN FETCH s.authors WHERE s.submissionID = :submissionID")
    Optional<Submission> findSubmissionWithAuthorsById(@Param("submissionID") Long submissionID);

    @Query("SELECT s FROM Submission s WHERE s.submissionID IN :submissionIds")
    List<Submission> findBySubmissionIds(@Param("submissionIds") List<Long> submissionIds);

    @Query("SELECT s FROM Submission s WHERE s.submissionID IN :submissionIds AND (s.status = 'pending' OR s.status = 'approved')")
    List<Submission> findPendingAndApprovedSubmissionsByIds(@Param("submissionIds") List<Long> submissionIds);

    // 根据特定用户ID查询Submission，支持分页
    Page<Submission> findByUserID(Long userID, Pageable pageable);

    // Custom query method to find submission by userID and submissionID
    Optional<Submission> findByUserIDAndSubmissionID(Long userID, Long submissionID);

    @NonNull
    @Override
    Page<Submission> findAll(@NonNull Pageable pageable);

    @Query("SELECT s FROM Submission s WHERE s.title LIKE %:keyword% OR s.abstractText LIKE %:keyword%")
    List<Submission> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT s FROM Submission s WHERE s.submissionID IN :submissionIds AND (s.status = 'assigned' OR s.status = 'in review')")
    List<Submission> findAssignedSubmissionsByIds(@Param("submissionIds") List<Long> submissionIds);

    @Query("SELECT s FROM Submission s WHERE s.submissionID IN :submissionIds AND s.status NOT IN ('assigned', 'in review')")
    List<Submission> findReviewedSubmissionsByIds(@Param("submissionIds") List<Long> submissionIds);

    @Query("SELECT DISTINCT s FROM Submission s LEFT JOIN FETCH s.authors")
    List<Submission> findAllSubmissionsWithAuthors();

    // 根据状态查询投稿数量
    int countByStatus(String status);

    // 查询当天已分配的投稿数量
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.status = :status AND s.submitDate = CURRENT_DATE")
    int countAssignedToday(@Param("status") String status);

    // 自定义查询：统计每个月的投稿数量
    @Query("SELECT MONTH(s.submitDate), COUNT(s) FROM Submission s GROUP BY MONTH(s.submitDate)")
    List<Object[]> getMonthlySubmissionStats();

    // 查询状态为 "REVIEWED" 的投稿
    List<Submission> findByStatus(String status);

    // 自定义查询：按状态统计每个月的评审数量
    @Query("SELECT MONTH(s.submitDate), COUNT(s) FROM Submission s WHERE s.status = :status GROUP BY MONTH(s.submitDate)")
    List<Object[]> getMonthlyReviewedStats(@Param("status") String status);
}
