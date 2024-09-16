package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.demo.entity.UserPaper;

@Repository
public interface UserPaperRepository extends JpaRepository<UserPaper, Long> {
}
