package edu.aut_conference.backend.repository.Author;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.aut_conference.backend.model.Author.Author;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}
