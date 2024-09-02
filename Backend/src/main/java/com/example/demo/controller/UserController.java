package com.example.demo.controller;

import com.example.demo.ResourceNotFoundException;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users_name")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    // Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Update user role
    @PutMapping("/{id}")
    public User updateUserRole(@PathVariable Integer id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setRole(updatedUser.getRole());
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
    }

    // Update user password
    @PutMapping("/{id}/password")
    public ResponseEntity<String> updatePassword(@PathVariable Integer id, @RequestBody UpdatePasswordRequest request) {
        boolean isUpdated = userService.updatePassword(id, request.getPassword());
        if (isUpdated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(500).body("Error updating password");
        }
    }

    // Update user submission status
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateSubmissionStatus(@PathVariable Integer id, @RequestBody UpdateSubmissionStatusRequest request) {
        boolean isUpdated = userService.updateSubmissionStatus(id, request.getSubmissionsStatus());
        if (isUpdated) {
            return ResponseEntity.ok("Submission status updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating submission status");
        }
    }

}
