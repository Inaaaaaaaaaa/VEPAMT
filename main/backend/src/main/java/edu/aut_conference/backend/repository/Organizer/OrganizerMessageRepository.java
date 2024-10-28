package edu.aut_conference.backend.repository.Organizer;

import edu.aut_conference.backend.model.Shared.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrganizerMessageRepository extends JpaRepository<Message, Long> {
    List<Message> findMessagesByUserID(Long userID);
    List<Message> findMessagesBySendedTo(String sendedTo);
    List<Message> findMessagesByUserIDAndSendedTo(Long userID, String sendedTo);

    // New method to support querying by a list of sendedTo values
    List<Message> findMessagesByUserIDAndSendedToIn(Long userID, List<String> sendedToValues);
}
