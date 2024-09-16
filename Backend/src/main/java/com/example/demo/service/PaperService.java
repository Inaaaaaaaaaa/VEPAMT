package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.repository.PaperRepository; 
import com.example.demo.entity.Paper; 
import java.util.Optional;

@Service
public class PaperService {

    @Autowired
    private PaperRepository paperRepository;

    public Optional<Paper> findPaperById(Long paperId) {
        return paperRepository.findById(paperId);
    }

    public Paper savePaper(Paper paper) {
        return paperRepository.save(paper);
    }
}
