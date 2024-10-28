package edu.aut_conference.backend.service.Author;

import edu.aut_conference.backend.model.Shared.Message;
import edu.aut_conference.backend.repository.Author.MessageRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    /* @Autowired */
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    /**
     * 获取所有消息
     * 
     * @return 所有消息的列表
     */
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // 根据ID获取单条消息
    public Message getMessageById(Long messageID) {
        return messageRepository.findById(messageID).orElse(null);
    }

    // 保存或更新消息
    public Message saveOrUpdateMessage(Message message) {
        return messageRepository.save(message);
    }

    // 删除消息
    public void deleteMessage(Long messageID) {
        messageRepository.deleteById(messageID);
    }

    /*Search Function*/
    // 根据关键词搜索消息
    public List<Message> searchMessages(String keyword) {
        return messageRepository.searchByKeyword(keyword);
    }

}