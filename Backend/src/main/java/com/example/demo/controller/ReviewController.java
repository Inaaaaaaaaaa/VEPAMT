package com.example.demo.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.demo.service.ReviewService;
import com.example.demo.dto.ReviewerDto; 

@RestController
@RequestMapping("/api")
public class ReviewController {
    
    @Autowired
    private ReviewService reviewService;

    @GetMapping("/reviewers")
    public List<ReviewerDto> getReviewersWithPapers() { 
        return reviewService.getReviewersWithPapers();
    }
}
