package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.dto.ReviewerDto; 

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // Use ReviewerDto consistently
    public List<ReviewerDto> getReviewersWithPapers() {
        return reviewRepository.findReviewersWithPapers();
    }
}
