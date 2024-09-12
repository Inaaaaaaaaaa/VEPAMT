package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "papers") // Assuming your table for papers is named 'papers'
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Unique identifier for each paper

    @Column(name = "paper_code", nullable = false, unique = true)
    private String paperCode;

    // Define the many-to-many relationship with User
    @ManyToMany(mappedBy = "papers")
    // Users who are associated with this paper
    private Set<User> users;  

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaperCode() {
        return paperCode;
    }

    public void setPaperCode(String paperCode) {
        this.paperCode = paperCode;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }
}
