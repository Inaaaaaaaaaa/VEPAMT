package com.example.demo.controller;

import com.example.demo.entity.Paper;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import com.example.demo.service.PaperService; 
import com.example.demo.dto.ReviewerDto;

import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/users_name")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PaperService paperService; 

    // Get all users
    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        return userOptional.map(user -> new ResponseEntity<>(user, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Update user (including role, email, etc.)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User existingUser = userOptional.get();
        // Update user details
        existingUser.setFirstName(updatedUser.getFirstName());
        existingUser.setLastName(updatedUser.getLastName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRoles(updatedUser.getRoles());

        // Save the updated user
        User savedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(savedUser);
    }

    // Update user password
    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordRequest request) {
        boolean isUpdated = userService.updatePassword(id, request.getPassword());
        if (isUpdated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating password");
        }
    }

    // Create a new user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            // Handle default values
            if (user.getLastLoggedIn() == null) {
                user.setLastLoggedIn(LocalDateTime.now());
            }
            if (user.getLastRegistered() == null) {
                user.setLastRegistered(LocalDateTime.now());
            }
            if (user.getSubmissionsStatus() == null) {
                user.setSubmissionsStatus("Pending");
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            e.printStackTrace();  // Log the error details for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update user submission status
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateSubmissionStatus(@PathVariable Long id, @RequestBody UpdateSubmissionStatusRequest request) {
        boolean isUpdated = userService.updateSubmissionStatus(id, request.getSubmissionsStatus());
        if (isUpdated) {
            return ResponseEntity.ok("Submission status updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating submission status");
        }
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();  // Return 404 if the user doesn't exist
        }
        userRepository.deleteById(id); 
        return ResponseEntity.noContent().build();  // Return 204 on successful deletion
    }

    // Add a reviewer to a paper
    @PutMapping("/{paperId}/reviewer")
    public ResponseEntity<?> addReviewer(@PathVariable Long paperId, @RequestBody ReviewerDto reviewerDto) {
        Optional<Paper> paperOptional = paperService.findPaperById(paperId);
        if (paperOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Paper not found");
        }
    
        Paper paper = paperOptional.get();
        // Set reviewer ID (assuming the Paper entity has a field for reviewerId)
        paper.setReviewer(reviewerDto.getReviewerId()); 
        
        Paper updatedPaper = paperService.savePaper(paper);
        return ResponseEntity.ok(updatedPaper);  // Return updated paper
    }
}
