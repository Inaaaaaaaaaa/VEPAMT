package com.example.demo.service;

import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public boolean updatePassword(Integer id, String newPassword) {
        return userRepository.findById(id)
            .map(user -> {
                user.setPassword(newPassword);
                userRepository.save(user);
                return true;
            })
            .orElse(false);
    }
}
