package edu.aut_conference.backend.controller.User;

import java.util.HashMap;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.repository.User.UserRepository;
import edu.aut_conference.backend.service.UserLogin.EmailService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@CrossOrigin("http://localhost:3000")
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private static final Random random = new Random();
    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/forgot_password")
    public ResponseEntity<?> forgotPassword(@RequestBody User user) {
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
        if (optionalUser.isPresent()) {
            int otp = 1000 + random.nextInt(9000); // 生成4位数的 OTP
            String htmlBody = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"UTF-8\"><title>OTP Email Template</title></head><body>"
                    +
                    "<div style=\"font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2\">"
                    +
                    "<div style=\"margin:50px auto;width:70%;padding:20px 0\">" +
                    "<div style=\"border-bottom:1px solid #eee\">" +
                    "<a href=\"\" style=\"font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600\">AUT ScholasticHub</a>"
                    +
                    "</div><p style=\"font-size:1.1em\">Hi " + optionalUser.get().getUsername() + ",</p>" +
                    "<p>Thank you for choosing AUT ScholasticHub. Use the following OTP to complete your Password Recovery Procedure. OTP is valid for 5 minutes.</p>"
                    +
                    "<h2 style=\"background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;\">"
                    + otp + "</h2>" +
                    "<p style=\"font-size:0.9em;\">Regards,<br />AUT ScholasticHub</p>" +
                    "<hr style=\"border:none;border-top:1px solid #eee\" />" +
                    "<div style=\"float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300\">"
                    +
                    "<p>AUT ScholasticHub Inc</p><p>1600 Amphitheatre Parkway</p><p>California</p></div></div></div></body></html>";
            emailService.sendHtmlMessage(user.getEmail(), "AUT ScholasticHub PASSWORD RECOVERY", htmlBody);

            // 返回 JSON 响应
            return ResponseEntity.ok(new HashMap<String, Object>() {
                {
                    put("success", true);
                    put("otp", otp);
                }
            });
        } else {
            // 返回错误信息
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new HashMap<String, Object>() {
                {
                    put("success", false);
                    put("message", "Email not registered");
                }
            });
        }
    }

    @PostMapping("/reset_password")
    public String resetPassword(@RequestBody User user) {
        Optional<User> optionalUser = userRepository.findByEmail(user.getEmail());
        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();

            // Check if the new password is the same as the current password
            if (passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                return "Your new password cannot be the same as the old password";
            }

            // Encrypt the new password before saving
            String encryptedPassword = passwordEncoder.encode(user.getPassword());
            existingUser.setPassword(encryptedPassword);
            userRepository.save(existingUser);

            return "Password reset successfully";
        } else {
            return "Email not registered";
        }
    }
}

