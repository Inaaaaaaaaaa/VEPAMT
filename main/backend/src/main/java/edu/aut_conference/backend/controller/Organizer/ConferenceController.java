package edu.aut_conference.backend.controller.Organizer;
import edu.aut_conference.backend.model.Shared.ConferenceStatus;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;
import java.io.IOException;

import edu.aut_conference.backend.model.UserLogin.User;
import edu.aut_conference.backend.model.Shared.Conference;
import edu.aut_conference.backend.service.Organizer.ConferenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.core.JsonProcessingException;
import java.util.ArrayList;
import java.util.Map;
import java.util.List;
import java.util.Optional;
import edu.aut_conference.backend.model.Shared.ConferenceStatus;

import java.time.LocalDate;


@RestController
@RequestMapping("/api/conferences")
public class ConferenceController {

    @Autowired
    private ConferenceService conferenceService;

    // 获取所有会议
    @GetMapping
    public ResponseEntity<List<Conference>> getAllConferences() {
        List<Conference> conferences = conferenceService.getAllConferences();
        return ResponseEntity.ok(conferences);
    }

    // 根据ID获取会议
    @GetMapping("/{conferenceID}")
    public ResponseEntity<Conference> getConferenceById(@PathVariable Long conferenceID) {
        Optional<Conference> conference = conferenceService.getConferenceById(conferenceID);
        return conference.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 搜索会议
    @GetMapping("/search/conferences")
    public ResponseEntity<List<Conference>> searchConferences(@RequestParam("query") String query) {
        List<Conference> conferences = conferenceService.searchConferences(query);
        return ResponseEntity.ok(conferences);
    }

    // 创建会议
    @PostMapping
    public ResponseEntity<Conference> createConference(@RequestBody Conference conference) {
        try {
            Conference savedConference = conferenceService.saveConference(conference);
            return ResponseEntity.ok(savedConference);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null); // 返回500状态码表示服务器错误
        }
    }

    // 删除会议
    @DeleteMapping("/{conferenceID}")
    public ResponseEntity<Void> deleteConference(@PathVariable Long conferenceID) {
        try {
            conferenceService.deleteConference(conferenceID);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // 获取会议的所有作者信息
    @GetMapping("/{conferenceId}/authors")
    public ResponseEntity<List<User>> getAuthorsByConferenceId(@PathVariable Long conferenceId) {
        try {
            List<User> authors = conferenceService.getAuthorsByConferenceId(conferenceId);
            return ResponseEntity.ok(authors);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();  // 错误处理
        }
    }

    // 添加会议
    @PostMapping("/add")
    public ResponseEntity<?> addConference(
            @RequestParam("title") String title,
            @RequestParam("date") String date,
            @RequestParam("startTime") String startTime,
            @RequestParam("location") String location,
            @RequestParam("description") String description,
            @RequestParam("registeredUsers") String registeredUsersJson,
            @RequestParam("email") String email,
            @RequestParam("attachments") List<MultipartFile> attachments) {

        ObjectMapper objectMapper = new ObjectMapper();
        List<Long> registeredUsers;

        try {
            // 将 registeredUsersJson 解析为 List<Long>
            registeredUsers = objectMapper.readValue(registeredUsersJson, new TypeReference<List<Long>>() {});
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body("Error parsing registeredUsers JSON");
        }

        // 存储文件的目标路径
        String fileSavePath = "C:/Users/GGPC/Documents/test/";

        // 处理附件（文件上传）
        List<String> savedFilePaths = new ArrayList<>(); // 用于存储文件路径
        for (MultipartFile file : attachments) {
            if (!file.isEmpty()) {
                try {
                    String fileName = file.getOriginalFilename();
                    Path filePath = Paths.get(fileSavePath + fileName);  // 将文件保存在指定目录下
                    Files.createDirectories(filePath.getParent()); // 如果路径不存在，则创建
                    Files.write(filePath, file.getBytes());  // 将文件写入磁盘
                    savedFilePaths.add(filePath.toString()); // 保存文件路径到列表
                    System.out.println("Saved file: " + fileName);
                } catch (IOException e) {
                    return ResponseEntity.status(500).body("Error processing file upload");
                }
            }
        }

        // 创建并保存 Conference 实例
        Conference conference = new Conference();
        conference.setTitle(title);
        conference.setDate(LocalDate.parse(date)); // 将字符串转为 LocalDate
        conference.setStartTime(startTime);
        conference.setLocation(location);
        conference.setDescription(description);
        conference.setRegisteredUsers(registeredUsers);
        conference.setEmail(email);
        conference.setAttachmentURL(savedFilePaths); // 将存储的文件路径列表设置到会议中
        conference.setStatus(ConferenceStatus.Draft);
        // 保存会议
        try {
            conferenceService.saveConference(conference);
            return ResponseEntity.ok(conference);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error saving conference");
        }
    }
    // 文件下载功能
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            // 假设文件存储在 C:/Users/GGPC/Documents/test/ 目录下
            Path filePath = Paths.get("C:/Users/GGPC/Documents/test/" + filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                        .body(resource);
            } else {
                System.out.println("File not found or is not readable: " + filename);
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            return ResponseEntity.status(500).build();
        }
    }
    // 返回格式化后的每月会议统计数据
    @GetMapping("/stats/monthly")
    public ResponseEntity<Map<String, Object>> getMonthlyConferenceStats() {
        Map<String, Object> stats = conferenceService.getMonthlyConferenceStats();
        return ResponseEntity.ok(stats); // 返回 200 OK 和数据
    }

    // 获取当天会议统计数据
    @GetMapping("/stats/today")
    public ResponseEntity<Map<String, Integer>> getDailyConferenceStats() {
        Map<String, Integer> stats = conferenceService.getDailyConferenceStats();
        return ResponseEntity.ok(stats); // 返回 200 OK 和数据
    }
    // 获取草稿状态的会议
    @GetMapping("/drafts")
    public ResponseEntity<List<Conference>> getDraftConferences() {
        List<Conference> draftConferences = conferenceService.getDraftConferences();
        return ResponseEntity.ok(draftConferences);
    }

    // 获取等待状态的会议
    @GetMapping("/waiting")
    public ResponseEntity<List<Conference>> getWaitingConferences() {
        List<Conference> waitingConferences = conferenceService.getWaitingConferences();
        return ResponseEntity.ok(waitingConferences);
    }
    // 更新会议信息和状态
    @PutMapping("/{id}")
    public ResponseEntity<Conference> updateConference(@PathVariable Long id, @RequestBody Conference updatedConference) {
        Conference conference = conferenceService.updateConference(id, updatedConference);
        return ResponseEntity.ok(conference);
    }
    @GetMapping("/user/{userID}/conferences")
    public ResponseEntity<List<Conference>> getConferencesByUser(@PathVariable Long userID) {
        List<Conference> conferences = conferenceService.getConferencesByUser(userID);
        return ResponseEntity.ok(conferences);
    }
    @GetMapping("/user/{userID}/relevant")
    public ResponseEntity<List<Conference>> getConferencesForUser(@PathVariable Long userID) {
        List<Conference> conferences = conferenceService.getConferencesByUser(userID);
        return ResponseEntity.ok(conferences);
    }
}
