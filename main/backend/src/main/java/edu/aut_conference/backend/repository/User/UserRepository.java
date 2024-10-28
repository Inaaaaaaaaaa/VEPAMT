package edu.aut_conference.backend.repository.User;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.aut_conference.backend.model.UserLogin.User;

import java.util.List;


import java.util.Optional;

// UserRepository 继承自 JpaRepository 来进行数据库操作
public interface UserRepository extends JpaRepository<User, Long> {

    // 自定义方法，通过邮箱查找用户
    Optional<User> findByEmail(String email);

    List<User> findByUserType(String userType);
}
