package com.example.demo.repository;

import com.example.demo.entity.User;
import com.example.demo.entity.Paper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> { 
    
    // Find user by role, case insensitive
    @Query("SELECT u FROM User u WHERE LOWER(u.roles) = LOWER(:roles)")
    Optional<User> findByRoleIgnoreCase(@Param("roles") String roles);

    // Find all papers associated with a given user
    @Query("SELECT p FROM User u JOIN u.papers p WHERE u.id = :userId")
    List<Paper> findPapersByUserId(@Param("userId") Long userId);
}
