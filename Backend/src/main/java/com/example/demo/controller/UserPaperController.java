package com.example.demo.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import com.example.demo.entity.UserPaper;
import com.example.demo.service.UserPaperService;


@RestController
@RequestMapping("/api")
public class UserPaperController {

    @Autowired
    private UserPaperService userPaperService;

    // Endpoint to fetch all user-paper relationships
    @GetMapping("/users_paper")
    public List<UserPaper> getAllUserPapers() {
        return userPaperService.getAllUserPapers();
    }
}
