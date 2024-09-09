package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

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
    private String roles;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "last_logged_in")
    private LocalDateTime lastLoggedIn;

    @Column(name = "last_registered")
    private LocalDateTime lastRegistered;

    @Column(name = "submissions_status")
    private String submissionsStatus;

    // Many-to-Many relationship with papers
    @ManyToMany
    @JoinTable(
        name = "user_papers",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "paper_id")
    )
    private Set<Paper> papers;

    // Getters and Setters

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
        return roles;
    }

    public void setRole(String role) {
        this.roles = roles;
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

    public String getSubmissionsStatus() {
        return submissionsStatus;
    }

    public void setSubmissionsStatus(String submissionsStatus) {
        this.submissionsStatus = submissionsStatus;
    }

    public Set<Paper> getPapers() {
        return papers;
    }

    public void setPapers(Set<Paper> papers) {
        this.papers = papers;
    }
}
