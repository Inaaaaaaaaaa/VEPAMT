package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import com.example.demo.entity.Review;
import com.example.demo.dto.ReviewerDto; 
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT new com.example.demo.dto.ReviewerDto(u.firstName, u.lastName, p.paperCode) " +
           "FROM User u JOIN Review r ON u.id = r.id.userId JOIN Paper p ON r.id.paperId = p.id")
    List<ReviewerDto> findReviewersWithPapers();
}
