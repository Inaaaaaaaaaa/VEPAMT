package com.example.demo.controller;

import com.example.demo.entity.Submission;
import com.example.demo.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/submissions")
@CrossOrigin(origins = "http://localhost:3000")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionService.getAllSubmissions();
    }

    @GetMapping("/{id}")
    public Submission getSubmissionById(@PathVariable Long id) {
        return submissionService.getSubmissionById(id);
    }

    @PostMapping
    public Submission createSubmission(@RequestBody Submission submission) {
        return submissionService.saveSubmission(submission);
    }

    @PutMapping("/{id}")
    public Submission updateSubmission(@PathVariable Long id, @RequestBody Submission submissionDetails) {
        return submissionService.updateSubmission(id, submissionDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
    }

    @PutMapping("/{id}/status")
    public Submission updateSubmissionStatus(@PathVariable Long id, @RequestBody String status) {
        Submission submission = submissionService.getSubmissionById(id);
        if (submission != null) {
            submission.setStatus(status);
            return submissionService.saveSubmission(submission);
        }
        return null;
    }
}
