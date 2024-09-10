package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Method to update the submission status of a user
    public boolean updateSubmissionStatus(Long id, String newStatus) { // Long used
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setSubmissionsStatus(newStatus); // Set the new status
            userRepository.save(user); // Save the user back to the database
            return true; // Update was successful
        } else {
            return false; // User not found, update failed
        }
    }

    // Method to update the password of a user
    @Transactional
    public boolean updatePassword(Long id, String newPassword) { // Long used
        return userRepository.findById(id)
            .map(user -> {
                user.setPassword(newPassword);
                userRepository.save(user); // Save the updated user to the database
                return true;
            })
            .orElse(false); // Return false if user is not found
    }
}
