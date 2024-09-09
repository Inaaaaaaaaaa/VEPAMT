package com.example.demo.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "papers")
public class Paper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "paper_id", nullable = false, unique = true)
    private String paperId;

    @ManyToMany(mappedBy = "papers", fetch = FetchType.LAZY)
    private Set<User> users = new HashSet<>();

    // Utility methods to manage bidirectional relationship
    public void addUser(User user) {
        this.users.add(user);
        user.getPapers().add(this);
    }

    public void removeUser(User user) {
        this.users.remove(user);
        user.getPapers().remove(this);
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaperId() {
        return paperId;
    }

    public void setPaperId(String paperId) {
        this.paperId = paperId;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void setUsers(Set<User> users) {
        this.users = users;
    }

    // Override equals and hashCode for proper comparison
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Paper paper = (Paper) o;
        return Objects.equals(id, paper.id) && Objects.equals(paperId, paper.paperId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, paperId);
    }
}
