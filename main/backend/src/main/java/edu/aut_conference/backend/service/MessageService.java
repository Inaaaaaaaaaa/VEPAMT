package edu.aut_conference.backend.service;

import edu.aut_conference.backend.model.Message;
import edu.aut_conference.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /**
     * 获取所有消息
     * @return 所有消息的列表
     */
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // 其他业务逻辑方法...
}