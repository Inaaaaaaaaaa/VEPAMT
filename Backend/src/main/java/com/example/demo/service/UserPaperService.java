package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.demo.entity.UserPaper;
import com.example.demo.repository.UserPaperRepository;

@Service
public class UserPaperService {

    @Autowired
    private UserPaperRepository userPaperRepository;

    public List<UserPaper> getAllUserPapers() {
        return userPaperRepository.findAll();
    }
}
