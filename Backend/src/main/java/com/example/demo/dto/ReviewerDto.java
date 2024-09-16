package com.example.demo.dto;

public class ReviewerDto {

    private Long reviewerId;
    private String firstName;
    private String lastName;
    private String paperCode;

    
    public ReviewerDto(String firstName, String lastName, String paperCode) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.paperCode = paperCode;
    }

    // Optionally, you can add another constructor that includes reviewerId
    public ReviewerDto(Long reviewerId, String firstName, String lastName, String paperCode) {
        this.reviewerId = reviewerId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.paperCode = paperCode;
    }

    // Getters
    public Long getReviewerId() {
        return reviewerId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPaperCode() {
        return paperCode;
    }

    // Setters
    public void setReviewerId(Long reviewerId) {
        this.reviewerId = reviewerId;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPaperCode(String paperCode) {
        this.paperCode = paperCode;
    }
}
