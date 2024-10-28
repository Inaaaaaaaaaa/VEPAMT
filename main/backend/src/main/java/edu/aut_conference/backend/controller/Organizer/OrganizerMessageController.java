package edu.aut_conference.backend.controller.Organizer;

import edu.aut_conference.backend.model.Shared.Message;
import edu.aut_conference.backend.service.Organizer.OrganizerMessageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerMessageController {

    @Autowired
    private OrganizerMessageService messageService;

    // 获取所有符合条件的消息 (GET 请求)
    @GetMapping("/messages")
    public List<Message> getMessages(@RequestParam("userID") Long userID, @RequestParam("role") String role) {
        // 调用服务层的方法获取符合条件的消息
        return messageService.getMessages(userID, role);
    }

    // 保存新消息 (POST 请求)
    @PostMapping("/messages")
    public Message saveMessage(@RequestBody Message message) {
        // 调用服务层的方法保存消息
        return messageService.saveMessage(message);
    }
}
