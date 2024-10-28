package edu.aut_conference.backend.service.Organizer;

import edu.aut_conference.backend.model.Shared.Message;
import edu.aut_conference.backend.repository.Organizer.OrganizerMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrganizerMessageService {

    @Autowired
    private OrganizerMessageRepository messageRepository;

    public List<Message> getMessages(Long userID, String role) {
        // 获取所有符合角色的 sendedTo 值
        List<String> sendedToValues = getSendedToValuesForRole(role);

        // 如果 sendedToValues 为空，则只返回 userID 的消息
        if (sendedToValues.isEmpty()) {
            return messageRepository.findMessagesByUserID(userID);
        }

        // 获取所有符合 userID 和角色的消息
        return messageRepository.findMessagesByUserIDAndSendedToIn(userID, sendedToValues);
    }

    private List<String> getSendedToValuesForRole(String role) {
        switch (role.toLowerCase()) {
            case "author":
                return List.of("A", "AO", "RA", "AR", "OA", "All");
            case "reviewer":
                return List.of("R", "AR", "RA", "RO", "OR", "All");
            case "organizer":
                return List.of("O", "AO", "RO", "OA", "OR", "All");
            default:
                // 如果未指定角色或角色无效，则返回空列表
                return List.of();
        }
    }

    public Message saveMessage(Message message) {
        // 直接保存消息
        return messageRepository.save(message);
    }
}
