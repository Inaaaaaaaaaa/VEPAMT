package edu.aut_conference.backend.controller.Author;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import edu.aut_conference.backend.model.Shared.Message;
import edu.aut_conference.backend.repository.Author.MessageRepository;
import edu.aut_conference.backend.service.Author.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageService messageService;

    @GetMapping
    public List<Message> getAllMessages() {
        return messageRepository.findAll();
    }

    // 根据ID获取单条消息
    @GetMapping("/{messageID}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long messageID) {
        Message message = messageService.getMessageById(messageID);
        if (message != null) {
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Message createMessage(@RequestBody Message message) {
        return messageRepository.save(message);
    }

    /* Search Function */
    // 根据关键词搜索消息
    @GetMapping("/search/suggestion")
    public ResponseEntity<List<Message>> searchMessages(@RequestParam("query") String query) {
        List<Message> messages = messageService.searchMessages(query);
        return ResponseEntity.ok(messages);
    }
}
