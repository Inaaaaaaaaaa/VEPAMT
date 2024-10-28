package edu.aut_conference.backend.model.Shared;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long messageID;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1024)
    private String content;

    @Column(nullable = false)
    private LocalDateTime time;

    @Column(nullable = true) // Make this nullable if it's not always required
    private Long userID;

    @Column(nullable = false)
    private String author;

    @Column(nullable = true)
    private String sendedTo;

    public Message() {
    }

    public Message(String type, String title, String content, LocalDateTime time, Long userID, String author, String sendedTo) {
        this.type = type;
        this.title = title;
        this.content = content;
        this.time = time;
        this.userID = userID;
        this.author = author;
        this.sendedTo = sendedTo;
    }

    // Getters and setters

    public Long getMessageID() {
        return messageID;
    }

    public void setMessageID(Long messageID) {
        this.messageID = messageID;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    // 使用@JsonProperty注解格式化时间字段
    @JsonProperty("time")
    public String getFormattedTime() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        return this.time.format(formatter);
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSendedTo() {
        return sendedTo;
    }

    public void setSendedTo(String sendedTo) {
        this.sendedTo = sendedTo;
    }
}
