package edu.aut_conference.backend.service.Author;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import edu.aut_conference.backend.model.Author.Author;
import edu.aut_conference.backend.model.Author.FileUpload;
import edu.aut_conference.backend.model.Author.Submission;
import edu.aut_conference.backend.repository.Author.AuthorRepository;
import edu.aut_conference.backend.repository.Author.FileUploadRepository;
import edu.aut_conference.backend.repository.Author.SubmissionRepository;
import edu.aut_conference.backend.repository.Reviewer.ReviewRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;

@Service
public class SubmissionService {

    @PersistenceContext
    private EntityManager entityManager;

    // Status constants
    // 状态常量
    private static final String STATUS_DRAFT = "Draft";
    private static final String STATUS_SUBMITTED = "Submitted";
    private static final String STATUS_UNDER_REVIEW = "Under Review";
    private static final String STATUS_ACCEPTED = "Accepted";
    private static final String STATUS_REJECTED = "Rejected";
    private static final String STATUS_UNASSIGNED = "Unassigned";
    private static final String STATUS_ASSIGNED = "Assigned";
    private static final String STATUS_IN_REVIEW = "In Review";
    private static final String STATUS_REVIEWED = "Reviewed";
    private static final String STATUS_COMPLETED = "Completed";
    private static final String STATUS_PENDING = "Pending";

    private static final String PREFIX = "Paper";
    private static final int RANDOM_NUMBER_LENGTH = 5;

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private FileUploadRepository fileUploadRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public Optional<Submission> findById(Long submissionId) {
        return submissionRepository.findById(submissionId);
    }

    public Submission save(Submission submission) {
        return submissionRepository.save(submission);
    }

    public Page<Submission> getAllSubmissions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("submitDate").descending());
        return submissionRepository.findAll(pageable);
    }

    public Page<Submission> findSubmissionsByUserId(Long userId, Pageable pageable) {
        return submissionRepository.findByUserID(userId, pageable);
    }

    @Transactional
    public Submission saveSubmission(Submission submission) {
        if (submission.getPaperID() == null || submission.getPaperID().isEmpty()) {
            submission.setPaperID(generatePaperID());
        }
        if (submission.isDraft()) {
            submission.setStatus(STATUS_DRAFT);
        }
        if (submission.getSubmitDate() == null) {
            submission.setSubmitDate(LocalDateTime.now());
        }
        if (submission.getUserID() == null) {
            throw new IllegalArgumentException("User ID is required for submission.");
        }

        List<Author> authors = submission.getAuthors();
        if (authors != null) {
            List<Author> managedAuthors = new ArrayList<>();
            for (Author author : authors) {
                if (author.getAuthorID() != null) {
                    author = authorRepository.findById(author.getAuthorID())
                            .orElseThrow(() -> new RuntimeException("Author not found"));
                } else {
                    author.setSubmission(submission);
                }
                managedAuthors.add(author);
            }
            submission.setAuthors(managedAuthors);
        }

        return submissionRepository.save(submission);
    }

    private String generatePaperID() {
        int year = LocalDateTime.now().getYear();
        String randomNumbers = generateRandomNumber(RANDOM_NUMBER_LENGTH);
        return PREFIX + year + "-" + randomNumbers;
    }

    private String generateRandomNumber(int length) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    public Author saveAuthor(Author author) {
        return authorRepository.save(author);
    }

    @Transactional
    public Submission finalizeSubmission(Long submissionID) {
        Submission submission = submissionRepository.findById(submissionID)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setDraft(true);
        submission.setStatus(STATUS_DRAFT);
        submission.setSubmitDate(LocalDateTime.now());
        return submissionRepository.save(submission);
    }

    public Submission findSubmissionById(Long submissionID) {
        return submissionRepository.findSubmissionWithAuthorsById(submissionID)
                .orElseThrow(() -> new RuntimeException("Submission not found with id " + submissionID));
    }

    public FileUpload findFileById(Long fileID) {
        return fileUploadRepository.findById(fileID)
                .orElseThrow(() -> new RuntimeException("File not found with id " + fileID));
    }

    @Transactional
    public Submission updateSubmissionStatus(Long submissionID, String status) {
        Submission submission = submissionRepository.findById(submissionID)
                .orElseThrow(() -> new RuntimeException("Submission not found with id " + submissionID));
        submission.setStatus(status);
        if (!STATUS_DRAFT.equals(status)) {
            submission.setDraft(false);
        }
        return submissionRepository.save(submission);
    }

    @Transactional
    public void deleteSubmission(Long submissionID) {
        Submission submission = submissionRepository.findById(submissionID)
                .orElseThrow(() -> new RuntimeException("Submission not found with id " + submissionID));
        submissionRepository.delete(submission);
    }

    @Transactional
    public Submission updateSubmissionStatusToPending(Long submissionID) {
        Submission submission = submissionRepository.findById(submissionID)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        if (submission.isDraft()) {
            submission.setDraft(false);
            submission.setStatus(STATUS_PENDING);
            submission.setSubmitDate(LocalDateTime.now());
        } else {
            throw new RuntimeException("Submission is not in draft state");
        }
        return submissionRepository.save(submission);
    }

    @Transactional
    public List<FileUpload> uploadFiles(Long submissionID, MultipartFile[] files) {
        Submission submission = submissionRepository.findById(submissionID)
                .orElseThrow(() -> new RuntimeException("Submission not found with ID: " + submissionID));
        List<FileUpload> fileUploads = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                FileUpload fileUpload = new FileUpload();
                fileUpload.setFileName(file.getOriginalFilename());
                fileUpload.setFileContent(file.getBytes());
                fileUpload.setSize(file.getSize());
                fileUpload.setSubmission(submission);
                fileUploads.add(fileUpload);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
            }
        }
        fileUploadRepository.saveAll(fileUploads);
        return fileUploads;
    }

    @Transactional
    public void deleteFile(Long fileID) {
        Optional<FileUpload> fileUploadOpt = fileUploadRepository.findById(fileID);
        if (fileUploadOpt.isPresent()) {
            FileUpload fileUpload = fileUploadOpt.get();
            fileUpload.getSubmission().getFiles().remove(fileUpload);
            fileUploadRepository.delete(fileUpload);
        } else {
            throw new EntityNotFoundException("File not found for ID: " + fileID);
        }
    }

    public List<Submission> searchSubmissions(String keyword) {
        return submissionRepository.searchByKeyword(keyword);
    }

    public List<Submission> findAssignedSubmissions(Long userId) {
        List<Long> submissionIds = reviewRepository.findSubmissionIdsByUserId(userId);
        return submissionRepository.findAssignedSubmissionsByIds(submissionIds);
    }

    public List<Submission> findReviewedSubmissions(Long userId) {
        List<Long> submissionIds = reviewRepository.findSubmissionIdsByUserId(userId);
        return submissionRepository.findReviewedSubmissionsByIds(submissionIds);
    }

    public Submission findSubmissionByUserAndID(Long userID, Long submissionID) {
        return submissionRepository.findByUserIDAndSubmissionID(userID, submissionID)
                .orElseThrow(() -> new EntityNotFoundException("Submission not found"));
    }

    public List<Submission> findReviewedSubmissionsByUserId(Long userId) {
        List<Long> submissionIds = reviewRepository.findReviewedSubmissionIdsByUserId(userId);
        return submissionRepository.findBySubmissionIds(submissionIds);
    }

    public List<Submission> findPendingAndApprovedSubmissions(Long userId) {
        List<Long> submissionIds = reviewRepository.findPendingAndApprovedSubmissionIdsByUserId(userId);
        return submissionRepository.findBySubmissionIds(submissionIds);
    }

    public List<Map<String, Object>> getAllSubmissionCards() {
        List<Submission> submissions = submissionRepository.findAllSubmissionsWithAuthors();

        return submissions.stream().map(submission -> {
            Map<String, Object> submissionMap = new HashMap<>();
            String authors = submission.getAuthors().stream()
                    .map(author -> author.getFirstName() + " " + author.getLastName())
                    .collect(Collectors.joining(", "));

            submissionMap.put("submissionID", submission.getSubmissionID());
            submissionMap.put("title", submission.getTitle());
            submissionMap.put("authors", authors);
            submissionMap.put("keywords", submission.getKeywords());
            submissionMap.put("submitDate", submission.getSubmitDate());
            submissionMap.put("status", submission.getStatus());

            return submissionMap;
        }).collect(Collectors.toList());
    }

    // 获取当天的投稿分配统计
    public Map<String, Integer> getDailySubmissionStats() {
        int waitingForAssign = submissionRepository.countByStatus(STATUS_UNASSIGNED);
        int assignedToday = submissionRepository.countByStatus(STATUS_ASSIGNED);
        Map<String, Integer> stats = new HashMap<>();
        stats.put("waitingForAssign", waitingForAssign);
        stats.put("assignedToday", assignedToday);
        return stats;
    }

    public Map<String, Object> getSubmissionMonthlyStats() {
        // 假设你从 repository 中获取统计数据
        List<Object[]> result = submissionRepository.getMonthlySubmissionStats();

        Map<String, Object> response = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();

        for (Object[] row : result) {
            Integer month = (Integer) row[0];
            Integer count = ((Number) row[1]).intValue();

            String label = month + "-1" + "-2024"; // 例如月份和年份的组合
            labels.add(label);
            data.add(count);
        }

        response.put("labels", labels);
        response.put("data", data);
        return response;
    }

    // 获取已评审的投稿
    public List<Submission> getReviewedSubmissions() {
        return submissionRepository.findByStatus(STATUS_REVIEWED);
    }

    // 获取当天的评审统计
    public Map<String, Integer> getTodayReviewStats() {
        int waitingForReview = submissionRepository.countByStatus(STATUS_ASSIGNED);
        int pendingDecision = submissionRepository.countByStatus(STATUS_IN_REVIEW);
        Map<String, Integer> stats = new HashMap<>();
        stats.put("waitingForReview", waitingForReview);
        stats.put("pendingDecision", pendingDecision);
        return stats;
    }

    // 获取每月的评审统计数据
    public Map<String, Object> getMonthlyReviewStats() {
        List<Object[]> result = submissionRepository.getMonthlyReviewedStats(STATUS_REVIEWED);
        Map<String, Object> response = new HashMap<>();
        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();
        for (Object[] row : result) {
            Integer month = (Integer) row[0];
            Integer count = ((Number) row[1]).intValue();
            String label = month + "-1" + "-2024";
            labels.add(label);
            data.add(count);
        }
        response.put("labels", labels);
        response.put("data", data);
        return response;
    }
}
