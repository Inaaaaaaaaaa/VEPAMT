package edu.aut_conference.backend.repository.Author;
import java.util.List;

public interface SearchRepository<T> {
    List<T> searchByKeyword(String keyword);
}
