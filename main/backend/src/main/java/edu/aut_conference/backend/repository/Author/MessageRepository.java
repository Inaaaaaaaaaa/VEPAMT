
/*package edu.aut_conference.backend.repository;

import edu.aut_conference.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

}*/

package edu.aut_conference.backend.repository.Author;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import edu.aut_conference.backend.model.Shared.Message;

import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE m.title LIKE %:keyword% OR m.content LIKE %:keyword%")
    List<Message> searchByKeyword(@Param("keyword") String keyword);
}
