package edu.aut_conference.backend.repository.Author;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.aut_conference.backend.model.Author.FileUpload;

public interface FileUploadRepository extends JpaRepository<FileUpload, Long> {
}
