package edu.aut_conference.backend.model.Shared;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Conference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conferenceID;  // 主键

    @Column(name = "User_ID")
    private Long userID;  // 外键，指向用户表的ID

    @Column(name = "Date")
    private LocalDate date;  // 日期类型

    @Column(name = "Start_Time")
    private String startTime;  // 存储会议开始时间

    @Column(name = "Location")
    private String location;  // 存储会议地点

    // 正确映射为 JSON 数组
    @ElementCollection
    @CollectionTable(name = "conference_registered_users", joinColumns = @JoinColumn(name = "conference_id"))
    @Column(name = "user_id")
    private List<Long> registeredUsers;  // 存储用户ID的列表

    @Column(name = "Email")
    private String email;  // 存储邮箱

    @ElementCollection
    @CollectionTable(name = "conference_attachments", joinColumns = @JoinColumn(name = "conference_id"))
    @Column(name = "attachment_url")
    private List<String> attachmentURL;  // 存储多个附件URL

    @Column(name = "Title")
    private String title;  // 存储会议标题

    @Column(name = "Description")
    private String description;  // 存储会议描述

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private ConferenceStatus status;  // 存储会议状态

    // Getters 和 Setters

    public Long getConferenceID() {
        return conferenceID;
    }

    public void setConferenceID(Long conferenceID) {
        this.conferenceID = conferenceID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<Long> getRegisteredUsers() {
        return registeredUsers;
    }

    public void setRegisteredUsers(List<Long> registeredUsers) {
        this.registeredUsers = registeredUsers;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getAttachmentURL() {
        return attachmentURL;
    }

    public void setAttachmentURL(List<String> attachmentURL) {
        this.attachmentURL = attachmentURL;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ConferenceStatus getStatus() {
        return status;
    }

    public void setStatus(ConferenceStatus status) {
        this.status = status;
    }
}
