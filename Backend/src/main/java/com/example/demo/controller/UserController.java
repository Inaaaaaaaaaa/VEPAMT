package com.example.demo.controller;

import com.example.demo.ResourceNotFoundException;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;

import java.util.Optional;
import java.util.Map;

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
    public ResponseEntity<String> updatePassword(@PathVariable Long id, @RequestBody UpdatePasswordRequest request) { // Change Integer to Long
        boolean isUpdated = userService.updatePassword(id, request.getPassword());
        if (isUpdated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(500).body("Error updating password");
        }
    }

    // Update user submission status
    @PutMapping("/{id}/status")
    public ResponseEntity<String> updateSubmissionStatus(@PathVariable Long id, @RequestBody UpdateSubmissionStatusRequest request) { // Change Integer to Long
        boolean isUpdated = userService.updateSubmissionStatus(id, request.getSubmissionsStatus());
        if (isUpdated) {
            return ResponseEntity.ok("Submission status updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating submission status");
        }
    }

    // Add the DELETE method to delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build(); // Return 404 if the user doesn't exist
        }
        userRepository.deleteById(id); // Delete the user by ID
        return ResponseEntity.noContent().build(); // Return 204 No Content after successful deletion
    }
}
