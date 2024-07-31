//package edu.aut_conference.backend.controller;
//
//import edu.aut_conference.backend.model.User;
//import edu.aut_conference.backend.repository.UserRepository;
//import edu.aut_conference.backend.service.EmailService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Optional;
//import java.util.Random;
//
//@RestController
//@CrossOrigin("http://localhost:3000")
//public class PasswordResetController {
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private EmailService emailService;
//
//    private static final Random random = new Random();
//
//    @PostMapping("/forgot_password")
//    public String forgotPassword(@RequestBody User user) {
//        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
//        if (optionalUser.isPresent()) {
//            int otp = 1000 + random.nextInt(9000); // Generate 4-digit OTP
//            String htmlBody = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>OTP Email Template</title></head><body>" +
//                    "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">" +
//                    "<div style=\"margin:50px auto;width:70%;padding:20px 0\">" +
//                    "<div style=\"border-bottom:1px solid #eee\">" +
//                    "<a href=\"\" style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">AUT ScholasticHub</a>" +
//                    "</div><p style=\"font-size:1.1em\">Hi " + optionalUser.get().getUsername() + ",</p>" +
//                    "<p>Thank you for choosing AUT ScholasticHub. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes.</p>" +
//                    "<h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">" + otp + "</h2>" +
//                    "<p style=\"font-size:0.9em;\">Regards,<br />AUT ScholasticHub</p>" +
//                    "<hr style=\"border:none;border-top:1px solid #eee\" />" +
//                    "<div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">" +
//                    "<p>AUT ScholasticHub Inc</p><p>1600 Amphitheatre Parkway</p><p>California</p></div></div></div></body></html>";
//            emailService.sendHtmlMessage(user.getEmail(), "AUT ScholasticHub PASSWORD RECOVERY", htmlBody);
//            return String.valueOf(otp);
//        } else {
//            return "Email not registered";
//        }
//    }
//
//    @PostMapping("/reset_password")
//    public String resetPassword(@RequestBody User user) {
//        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
//        if (optionalUser.isPresent()) {
//            User existingUser = optionalUser.get();
//
//            // Check if the new password is the same as the current password
//            if (existingUser.getPassword().equals(user.getPassword())) {
//                return "Your new password cannot be the same as the old password";
//            }
//
//            existingUser.setPassword(user.getPassword()); // Save new password
//            userRepository.save(existingUser);
//            return "Password reset successfully";
//        } else {
//            return "Email not registered";
//        }
//    }
//}
//
