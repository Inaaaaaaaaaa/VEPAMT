package edu.aut_conference.backend.controller.User;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.aut_conference.backend.model.Shared.UserProfile;
import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.service.User.UserProfileService;
import edu.aut_conference.backend.service.User.UserService;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import java.net.URLConnection;
import java.io.ByteArrayInputStream;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/api/userProfile")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private UserService userService;

    private static final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @GetMapping
    public List<UserProfile> getAllUserProfiles() {
        return userProfileService.getAllUserProfiles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserProfile> getUserProfileById(@PathVariable Long id) {
        Optional<UserProfile> userProfile = userProfileService.getUserProfileById(id);
        return userProfile.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
    }

    @GetMapping("/extended/{id}")
    public ResponseEntity<UserProfile> getExtendedUserProfileById(@PathVariable Long id) {
        // Try to find the UserProfile first
        Optional<UserProfile> userProfileOptional = userProfileService.getUserProfileById(id);

        // If UserProfile is found, return it (keeping the original logic intact)
        if (userProfileOptional.isPresent()) {
            return ResponseEntity.ok(userProfileOptional.get());
        } else {
            // If UserProfile is not found, attempt to fetch the corresponding User data
            Optional<User> userOptional = userService.getUserById(id);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                // Create a new UserProfile based on the User data
                UserProfile newUserProfile = new UserProfile();
                newUserProfile.setId(user.getId());
                newUserProfile.setFirstName(user.getFirstName());
                newUserProfile.setLastName(user.getLastName());
                newUserProfile.setEmail(user.getEmail());
                newUserProfile.setCountry("New Zealand"); // Default or fetched if available

                // Save the new profile to maintain consistency
                UserProfile savedProfile = userProfileService.saveOrUpdateUserProfile(newUserProfile);
                return ResponseEntity.ok(savedProfile);
            } else {
                // If neither UserProfile nor User is found, return 404 Not Found
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        }
    }

    @PostMapping
    public ResponseEntity<UserProfile> saveOrUpdateUserProfile(@RequestBody UserProfile userProfile) {
        UserProfile updatedProfile = userProfileService.saveOrUpdateUserProfile(userProfile);
        return ResponseEntity.ok(updatedProfile);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUserProfile(@PathVariable Long id) {
        userProfileService.deleteUserProfile(id);
        return ResponseEntity.ok("User profile deleted successfully.");
    }

    @GetMapping("/batch")
    public ResponseEntity<List<User>> getUsersByIds(@RequestParam List<Long> ids) {
        List<User> users = userService.getUsersByIds(ids);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateUserProfile(
            @RequestParam("userId") Long userId,
            @RequestParam(value = "firstName", required = false) String firstName,
            @RequestParam(value = "lastName", required = false) String lastName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "jobTitle", required = false) String jobTitle,
            @RequestParam(value = "organization", required = false) String organization,
            @RequestParam(value = "country", required = false) String country,
            @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            // Fetch or create UserProfile entity
            Optional<UserProfile> optionalUserProfile = userProfileService.getUserProfileById(userId);
            UserProfile userProfile = optionalUserProfile.orElseGet(() -> {
                UserProfile newUserProfile = new UserProfile();
                newUserProfile.setId(userId); // Setting the same ID as User ID
                return newUserProfile;
            });

            // 更新UserProfile表中的字段
            if (firstName != null)
                userProfile.setFirstName(firstName);
            if (lastName != null)
                userProfile.setLastName(lastName);
            if (email != null)
                userProfile.setEmail(email);
            if (jobTitle != null)
                userProfile.setJobTitle(jobTitle);
            if (organization != null)
                userProfile.setOrganization(organization);
            if (country != null)
                userProfile.setCountry(country);
            if (phoneNumber != null)
                userProfile.setPhoneNumber(phoneNumber);
            if (profilePicture != null && !profilePicture.isEmpty()) {
                userProfile.setProfilePicture(profilePicture.getBytes());
            }

            userProfileService.saveOrUpdateUserProfile(userProfile);
            return ResponseEntity.ok("User profile updated successfully!");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving profile picture.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user profile.");
        }
    }

    @GetMapping("/profile-picture")
    public ResponseEntity<byte[]> getProfilePicture(@RequestParam("userId") Long userId) {
        try {
            Optional<UserProfile> optionalUserProfile = userProfileService.getUserProfileById(userId);

            if (optionalUserProfile.isPresent()) {
                UserProfile userProfile = optionalUserProfile.get();
                byte[] profilePicture = userProfile.getProfilePicture();

                if (profilePicture != null) {
                    // 确定图片的MIME类型
                    String mimeType = URLConnection
                            .guessContentTypeFromStream(new ByteArrayInputStream(profilePicture));

                    if (mimeType == null) {
                        mimeType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // 如果无法确定类型，则返回二进制流
                    }

                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(mimeType))
                            .body(profilePicture);
                } else {
                    return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
