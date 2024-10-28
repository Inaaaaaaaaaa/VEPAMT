package edu.aut_conference.backend.model.Author;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

@Entity
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long submissionID;

    @Column(unique = true, nullable = false)
    private String paperID;

    private String title;
    private String track;
    private Long userID;

    @Column(length = 1024)
    private String keywords;

    private String abstractText;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @JsonManagedReference
    private List<Author> authors = new ArrayList<>();

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<FileUpload> files = new ArrayList<>();

    private boolean isDraft;
    private String status;
    private LocalDateTime submitDate;

    // Getters and Setters
    public Long getSubmissionID() {
        return submissionID;
    }

    public void setSubmissionID(Long submissionID) {
        this.submissionID = submissionID;
    }

    public String getPaperID() {
        return paperID;
    }

    public void setPaperID(String paperID) {
        this.paperID = paperID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTrack() {
        return track;
    }

    public void setTrack(String track) {
        this.track = track;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getKeywords() {
        return keywords;
    }

    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }

    public void setKeywordsFromList(List<String> keywords) {
        if (keywords != null) {
            this.keywords = String.join(",", keywords);
        } else {
            this.keywords = "";
        }
    }

    public List<String> getKeywordsAsList() {
        if (keywords == null || keywords.isEmpty()) {
            return new ArrayList<>();
        }
        return Arrays.asList(keywords.split("\\s*,\\s*"));
    }

    public String getAbstractText() {
        return abstractText;
    }

    public void setAbstractText(String abstractText) {
        this.abstractText = abstractText;
    }

    public List<Author> getAuthors() {
        return authors;
    }

    public void setAuthors(List<Author> authors) {
        this.authors.clear();
        if (authors != null) {
            authors.forEach(this::addAuthor);
        }
    }

    public List<FileUpload> getFiles() {
        return files;
    }

    public void setFiles(List<FileUpload> files) {
        this.files.clear();
        if (files != null) {
            files.forEach(this::addFile);
        }
    }

    public boolean isDraft() {
        return isDraft;
    }

    public void setDraft(boolean draft) {
        isDraft = draft;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSubmitDate() {
        return submitDate;
    }

    public void setSubmitDate(LocalDateTime submitDate) {
        this.submitDate = submitDate;
    }

    // Utility methods for relationship management
    public void addFile(FileUpload file) {
        files.add(file);
        file.setSubmission(this);
    }

    public void removeFile(FileUpload file) {
        files.remove(file);
        file.setSubmission(null);
    }

    public void addAuthor(Author author) {
        authors.add(author);
        author.setSubmission(this);
    }

    public void removeAuthor(Author author) {
        authors.remove(author);
        author.setSubmission(null);
    }
}
