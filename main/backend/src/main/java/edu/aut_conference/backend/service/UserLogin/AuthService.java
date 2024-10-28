package edu.aut_conference.backend.service.UserLogin;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.repository.User.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public String register(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return "Email already registered";
        }
        // Encrypt the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setUserType("author");
        userRepository.save(user);
        return "User registered successfully!";
    }

    public String authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Verify the password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return "Login Successfully";
            } else {
                return "Incorrect password";
            }
        } else {
            return "Email not registered";
        }
    }
}
