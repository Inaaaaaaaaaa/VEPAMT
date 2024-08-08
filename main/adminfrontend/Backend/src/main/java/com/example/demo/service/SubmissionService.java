package com.example.demo.service;

import com.example.demo.entity.Submission;
import com.example.demo.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id).orElse(null);
    }

    public Submission saveSubmission(Submission submission) {
        return submissionRepository.save(submission);
    }

    public Submission updateSubmission(Long id, Submission submissionDetails) {
        Submission submission = submissionRepository.findById(id).orElse(null);
        if (submission != null) {
            submission.setFirstName(submissionDetails.getFirstName());
            submission.setLastName(submissionDetails.getLastName());
            submission.setEmail(submissionDetails.getEmail());
            submission.setPassword(submissionDetails.getPassword());
            submission.setStatus(submissionDetails.getStatus());
            submission.setPaperId(submissionDetails.getPaperId());
            return submissionRepository.save(submission);
        }
        return null;
    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }
}
