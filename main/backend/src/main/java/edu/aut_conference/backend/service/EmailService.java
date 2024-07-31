//package edu.aut_conference.backend.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//@Service
//public class EmailService {
//
//    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
//
//    @Autowired
//    private JavaMailSender emailSender;
//
//    public void sendSimpleMessage(String to, String subject, String text) {
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setFrom("jingzhaopiao@gmail.com");
//            message.setTo(to);
//            message.setSubject(subject);
//            message.setText(text);
//            emailSender.send(message);
//            logger.info("Simple email sent to {}", to);
//        } catch (Exception e) {
//            logger.error("Failed to send simple email to {}: {}", to, e.getMessage());
//        }
//    }
//
//    public void sendHtmlMessage(String to, String subject, String htmlBody) {
//        MimeMessage message = emailSender.createMimeMessage();
//        try {
//            MimeMessageHelper helper = new MimeMessageHelper(message, true);
//            helper.setFrom("jingzhaopiao@gmail.com");
//            helper.setTo(to);
//            helper.setSubject(subject);
//            helper.setText(htmlBody, true);
//            emailSender.send(message);
//            logger.info("HTML email sent to {}", to);
//        } catch (MessagingException e) {
//            logger.error("Failed to send HTML email to {}: {}", to, e.getMessage());
//            throw new RuntimeException("Failed to send email", e);
//        }
//    }
//}
