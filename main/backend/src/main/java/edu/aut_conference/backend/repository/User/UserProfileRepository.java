package edu.aut_conference.backend.repository.User;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

import edu.aut_conference.backend.model.Shared.UserProfile;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserID(Long userID);
}
