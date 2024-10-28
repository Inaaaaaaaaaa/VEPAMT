package edu.aut_conference.backend.service.User;

import java.util.Optional;
import org.springframework.stereotype.Service; // 确保导入了正确的注解

import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.repository.User.UserRepository;

import java.util.List;

@Service // 使用 Spring 的 @Service 注解
public class UserService {

    private final UserRepository userRepository;

    // 构造器注入
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // 通过多个 ID 获取用户列表
    public List<User> getUsersByIds(List<Long> ids) {
        return userRepository.findAllById(ids);
    }

    public List<User> getUsersByType(String userType) {
        return userRepository.findByUserType(userType);
    }

    // Find user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Save or update a user
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
