package edu.aut_conference.backend.repository.Author;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.aut_conference.backend.model.Author.Event;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByDueDateBetween(LocalDate startDate, LocalDate endDate);
}
