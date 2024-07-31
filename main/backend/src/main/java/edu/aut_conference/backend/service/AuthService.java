//package edu.aut_conference.backend.service;
//
//import edu.aut_conference.backend.model.User;
//import edu.aut_conference.backend.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class AuthService {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    public String register(User user) {
//        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
//        if (existingUser.isPresent()) {
//            return "Email already registered";
//        }
//        userRepository.save(user);
//        return "User registered successfully!";
//    }
//
//    public String authenticate(String email, String password) {
//        Optional<User> userOpt = userRepository.findByEmail(email);
//        if (userOpt.isPresent()) {
//            User user = userOpt.get();
//            if (user.getPassword().equals(password)) {
//                return "Login Successfully";
//            } else {
//                return "Incorrect password";
//            }
//        } else {
//            return "Email not registered";
//        }
//    }
//}
