package edu.aut_conference.backend.model.Author;

import com.fasterxml.jackson.annotation.JsonBackReference;


import jakarta.persistence.*;

@Entity
public class FileUpload {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileID;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileContent;  // Storing the file content

    private long size;

    private String fileName;

    @ManyToOne
    @JoinColumn(name = "submissionID")
    @JsonBackReference // Prevents infinite recursion
    private Submission submission;

    // Getters and Setters
    public Long getFileID() {
        return fileID;
    }

    public void setFileID(Long fileID) {
        this.fileID = fileID;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public byte[] getFileContent() {
        return fileContent;
    }

    public void setFileContent(byte[] fileContent) {
        this.fileContent = fileContent;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
