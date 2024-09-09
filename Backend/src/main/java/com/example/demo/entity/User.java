package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users_name")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "First_name", nullable = false)
    private String firstName;

    @Column(name = "Last_name", nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String role;

    @Column(name = "paper_id", nullable = false)
    private String paperId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "last_logged_in", nullable = true)
    private LocalDateTime lastLoggedIn;

    @Column(name = "last_registered", nullable = true)
    private LocalDateTime lastRegistered;

    // Add submissionsStatus field
    @Column(name = "submissions_status", nullable = true)
    private String submissionsStatus;

    // Getters and setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getPaperId() {
        return paperId;
    }

    public void setPaperId(String paperId) {
        this.paperId = paperId;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getLastLoggedIn() {
        return lastLoggedIn;
    }

    public void setLastLoggedIn(LocalDateTime lastLoggedIn) {
        this.lastLoggedIn = lastLoggedIn;
    }

    public LocalDateTime getLastRegistered() {
        return lastRegistered;
    }

    public void setLastRegistered(LocalDateTime lastRegistered) {
        this.lastRegistered = lastRegistered;
    }

    // Getter and setter for submissionsStatus
    public String getSubmissionsStatus() {
        return submissionsStatus;
    }

    public void setSubmissionsStatus(String submissionsStatus) {
        this.submissionsStatus = submissionsStatus;
    }
}
