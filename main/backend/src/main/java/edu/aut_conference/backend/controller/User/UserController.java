package edu.aut_conference.backend.controller.User;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.repository.User.UserRepository;
import edu.aut_conference.backend.service.User.UserService;
import edu.aut_conference.backend.service.UserLogin.AuthService;

@RestController
@CrossOrigin("http://localhost:3000") // Adjust based on your frontend URL
@RequestMapping("/api/users") // 为所有用户操作添加统一的路径前缀
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        String authenticationResult = authService.authenticate(user.getEmail(), user.getPassword());

        if (authenticationResult.equals("Login Successfully")) {
            Optional<User> authenticatedUser = userRepository.findByEmail(user.getEmail());

            if (authenticatedUser.isPresent()) {
                // Include User ID, User Type, Username, and Login message in the response
                return ResponseEntity.ok(
                        Map.of(
                                "message", "Login Successfully",
                                "userId", authenticatedUser.get().getId(), // Assuming `getId()` returns the User ID
                                "userType", authenticatedUser.get().getUserType(),
                                "username", authenticatedUser.get().getUsername() // Include username here
                        ));
            } else {
                // Email not found in the system
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "User not found"));
            }
        } else {
            // Handle failed authentication
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", authenticationResult));
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/user")
    public User newUser(@RequestBody User newUser) {
        return userRepository.save(newUser);
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/reviewers")
    public ResponseEntity<List<User>> getReviewers() {
        List<User> reviewers = userService.getUsersByType("reviewer");
        return ResponseEntity.ok(reviewers);
    }

    // 获取所有 usertype 为 "author" 的用户
    @GetMapping("/authors")
    public ResponseEntity<List<User>> getAuthors() {
        List<User> authors = userService.getUsersByType("author");
        return ResponseEntity.ok(authors);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<User>> getUsersByIds(@RequestBody List<Long> userIds) {
        List<User> users = userRepository.findAllById(userIds);
        return ResponseEntity.ok(users);
    }

}
