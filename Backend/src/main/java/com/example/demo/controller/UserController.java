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

    // Update user role
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> updatedRole) {
        Optional<User> userOptional = userRepository.findById(id);
        if (!userOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        user.setRoles(updatedRole.get("role")); // Use the "role" key from the request body

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser); // Return the updated user
    }

    // Update user password
    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordRequest request) { 
        boolean isUpdated = userService.updatePassword(id, request.getPassword());
        if (isUpdated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(500).body("Error updating password");
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
            // Return 404 if the user doesn't exist
            return ResponseEntity.notFound().build(); 
        }
        userRepository.deleteById(id); 
        return ResponseEntity.noContent().build(); 
    }

    @PutMapping("/{paperId}/reviewer")
    public ResponseEntity<?> addReviewer(@PathVariable Long paperId, @RequestBody ReviewerDto reviewerDto) {
        try {
            // Step 1: Find the paper by ID
            Optional<Paper> optionalPaper = paperService.findPaperById(paperId);
            
            if (!optionalPaper.isPresent()) {
                // Step 2: If paper is not found, return a 404 response
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Paper not found");
            }

            // Step 3: Get the paper and update its reviewer information
            Paper paper = optionalPaper.get();
            // Assuming Paper class has a method to set reviewers or add to a list of reviewers
            paper.setReviewer(reviewerDto.getReviewerId()); // Adjust this based on your data model
            
            // Step 4: Save the updated paper
            Paper updatedPaper = paperService.savePaper(paper);

            // Step 5: Return the updated paper in the response
            return ResponseEntity.ok(updatedPaper);
        } catch (Exception e) {
            // Step 6: Handle any exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the reviewer");
        }
    }
}
