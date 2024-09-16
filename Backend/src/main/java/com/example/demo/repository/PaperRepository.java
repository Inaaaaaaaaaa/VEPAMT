package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Paper;

public interface PaperRepository extends JpaRepository<Paper, Long> {
}
