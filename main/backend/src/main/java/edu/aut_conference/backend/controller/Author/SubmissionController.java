package edu.aut_conference.backend.controller.Author;

import edu.aut_conference.backend.model.Author.Author;
import edu.aut_conference.backend.model.Author.FileUpload;
import edu.aut_conference.backend.model.Author.Submission;
import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.service.Author.SubmissionService;
import edu.aut_conference.backend.service.User.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.apache.el.stream.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import edu.aut_conference.backend.service.User.UserService;

import java.net.URLConnection;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final UserService userService;

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    public SubmissionController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/submissions/author")
    public ResponseEntity<Author> saveAuthor(@Valid @RequestBody Author author) {
        try {
            Author savedAuthor = submissionService.saveAuthor(author);
            return ResponseEntity.ok(savedAuthor);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/submissions/draft")
    public ResponseEntity<Submission> createDraftSubmission(@Valid @RequestBody Submission submission) {
        try {
            if (submission.getTitle() == null || submission.getAuthors() == null ||
                    submission.getTrack() == null || submission.getKeywords() == null ||
                    submission.getAbstractText() == null || submission.getUserID() == null) {
                return ResponseEntity.badRequest().body(null);
            }

            submission.setStatus("Draft");
            submission.setDraft(true);
            submission.getAuthors().forEach(author -> author.setSubmission(submission));

            Submission savedSubmission = submissionService.saveSubmission(submission);
            submission.setSubmissionID(savedSubmission.getSubmissionID());

            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/submissions/{submissionID}/finalize")
    public ResponseEntity<Submission> finalizeSubmission(@PathVariable Long submissionID) {
        try {
            Submission finalizedSubmission = submissionService.finalizeSubmission(submissionID);
            return ResponseEntity.ok(finalizedSubmission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/submissions/{submissionID}/status")
    public ResponseEntity<Map<String, String>> updateSubmissionStatus(@PathVariable Long submissionID,
            @RequestBody Map<String, String> requestBody) {
        try {
            String newStatus = requestBody.get("status");
            Submission updatedSubmission = submissionService.updateSubmissionStatus(submissionID, newStatus);
            return ResponseEntity.ok(Map.of("status", updatedSubmission.getStatus()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/submissions/{submissionID}/submit")
    public ResponseEntity<Submission> submitDraft(@PathVariable Long submissionID) {
        try {
            Submission updatedSubmission = submissionService.updateSubmissionStatusToPending(submissionID);
            return ResponseEntity.ok(updatedSubmission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/submissions/{submissionID}")
    public ResponseEntity<Submission> getSubmission(@PathVariable Long submissionID) {
        try {
            Submission submission = submissionService.findSubmissionById(submissionID);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 根据用户ID获取用户所有提交的论文
    @GetMapping("/user/{userId}/submissions")
    public ResponseEntity<Page<Submission>> getSubmissionsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Submission> submissions = submissionService.findSubmissionsByUserId(userId, pageable);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/submissions")
    public ResponseEntity<Map<String, Object>> getAllSubmissions(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Submission> submissionsPage = submissionService.getAllSubmissions(page, size);
            Map<String, Object> response = Map.of(
                    "submissions", submissionsPage.getContent(),
                    "currentPage", submissionsPage.getNumber(),
                    "totalItems", submissionsPage.getTotalElements(),
                    "totalPages", submissionsPage.getTotalPages());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/submissions/{submissionID}")
    public ResponseEntity<Submission> updateSubmission(@PathVariable Long submissionID,
            @Valid @RequestBody Submission submissionDetails) {
        System.out.println("Received submission data for update: " + submissionDetails);
        try {
            Submission submission = submissionService.findSubmissionById(submissionID);
            if (submissionDetails.getTitle() != null)
                submission.setTitle(submissionDetails.getTitle());
            if (submissionDetails.getTrack() != null)
                submission.setTrack(submissionDetails.getTrack());
            if (submissionDetails.getKeywords() != null)
                submission.setKeywordsFromList(submissionDetails.getKeywordsAsList());
            if (submissionDetails.getAbstractText() != null)
                submission.setAbstractText(submissionDetails.getAbstractText());
            if (submissionDetails.getStatus() != null)
                submission.setStatus(submissionDetails.getStatus());
            submission.setDraft(submissionDetails.isDraft());

            submission.setAuthors(submissionDetails.getAuthors());
            submission.setFiles(submissionDetails.getFiles());

            Submission updatedSubmission = submissionService.saveSubmission(submission);
            return ResponseEntity.ok(updatedSubmission);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/submissions/{submissionID}")
    public ResponseEntity<?> deleteSubmission(@PathVariable Long submissionID) {
        try {
            submissionService.deleteSubmission(submissionID);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/user/{userID}/submission/{submissionID}")
    public ResponseEntity<Submission> getSubmissionByUserAndID(
            @PathVariable Long userID,
            @PathVariable Long submissionID) {
        try {
            Submission submission = submissionService.findSubmissionByUserAndID(userID, submissionID);
            if (submission == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @PostMapping("/submissions/{submissionID}/files")
    public ResponseEntity<Submission> uploadFiles(@PathVariable Long submissionID,
            @RequestParam("files") MultipartFile[] files) {
        try {
            Submission submission = submissionService.findSubmissionById(submissionID);
            List<FileUpload> fileUploads = submission.getFiles();
            for (MultipartFile file : files) {
                FileUpload fileUpload = new FileUpload();
                fileUpload.setSize(file.getSize());
                fileUpload.setFileContent(file.getBytes());
                fileUpload.setFileName(file.getOriginalFilename());
                fileUpload.setSubmission(submission);
                fileUploads.add(fileUpload);
            }
            Submission updatedSubmission = submissionService.saveSubmission(submission);
            return ResponseEntity.ok(updatedSubmission);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/files/{fileID}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable Long fileID) {
        try {
            FileUpload fileUpload = submissionService.findFileById(fileID);
            String fileName = fileUpload.getFileName();
            String mimeType = URLConnection.guessContentTypeFromName(fileName);
            if (mimeType == null) {
                mimeType = "application/octet-stream";
            }
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + fileName + "\"")
                    .header("Content-Type", mimeType)
                    .body(fileUpload.getFileContent());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/files/{fileID}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileID) {
        try {
            submissionService.deleteFile(fileID);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/search/submissions")
    public ResponseEntity<Object> searchSubmissions(@RequestParam("query") String query) {
        List<Submission> submissions = submissionService.searchSubmissions(query);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/user/{userID}/assigned")
    public ResponseEntity<List<Submission>> findPendingAndApprovedSubmissions(@PathVariable Long userID) {
        try {
            List<Submission> submissions = submissionService.findPendingAndApprovedSubmissions(userID);
            return ResponseEntity.ok(submissions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/user/{userId}/reviewed")
    public ResponseEntity<List<Submission>> findReviewedSubmissions(@PathVariable Long userId) {
        try {
            List<Submission> reviewedSubmissions = submissionService.findReviewedSubmissionsByUserId(userId);
            return ResponseEntity.ok(reviewedSubmissions);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/submissions/cards")
    public List<Map<String, Object>> getAllSubmissionCards() {
        return submissionService.getAllSubmissionCards();
    }

    // 返回格式化后的每月投稿统计数据
    @GetMapping("/submissions/stats/monthly/submissions")
    public Map<String, Object> getSubmissionMonthlyStats() {
        return submissionService.getSubmissionMonthlyStats();
    }

    @GetMapping("/submissions/stats/today/submissions")
    public ResponseEntity<Map<String, Integer>> getDailySubmissionStats() {
        Map<String, Integer> stats = submissionService.getDailySubmissionStats();
        return ResponseEntity.ok(stats); // 返回 200 OK 和数据
    }

    @GetMapping("/submissions/reviews")
    public ResponseEntity<List<Submission>> getReviewedSubmissions() {
        List<Submission> reviewedSubmissions = submissionService.getReviewedSubmissions();
        return ResponseEntity.ok(reviewedSubmissions);
    }

    // 获取当天评审统计数据
    @GetMapping("/submissions/stats/today/reviews")
    public ResponseEntity<Map<String, Integer>> getTodayReviewStats() {
        Map<String, Integer> reviewStats = submissionService.getTodayReviewStats();
        return ResponseEntity.ok(reviewStats);
    }

    // 获取每月评审统计数据
    @GetMapping("/submissions/stats/monthly/reviews")
    public ResponseEntity<Map<String, Object>> getMonthlyReviewStats() {
        Map<String, Object> monthlyStats = submissionService.getMonthlyReviewStats();
        return ResponseEntity.ok(monthlyStats);
    }


    @GetMapping("/submissions/users/{userID}")
    public ResponseEntity<User> getUserById(@PathVariable Long userID) {
        List<User> users = userService.getUsersByIds(List.of(userID)); // 使用已有的 getUsersByIds 方法
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users.get(0)); // 获取列表中的第一个用户
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    
}
