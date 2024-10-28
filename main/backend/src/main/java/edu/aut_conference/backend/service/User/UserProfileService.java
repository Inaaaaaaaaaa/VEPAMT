package edu.aut_conference.backend.service.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.aut_conference.backend.model.Shared.UserProfile;
import edu.aut_conference.backend.repository.User.UserProfileRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    public UserProfileService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    public Optional<UserProfile> findByUserId(Long userId) {
        return userProfileRepository.findByUserID(userId);
    }

    public List<UserProfile> getAllUserProfiles() {
        return userProfileRepository.findAll();
    }

    public Optional<UserProfile> getUserProfileById(Long id) {
        return userProfileRepository.findById(id);
    }

    public UserProfile saveOrUpdateUserProfile(UserProfile userProfile) {
        // 添加日志以帮助调试
        System.out.println("Saving UserProfile: " + userProfile);
        return userProfileRepository.save(userProfile);
    }

    public void deleteUserProfile(Long id) {
        userProfileRepository.deleteById(id);
    }
}
