package com.example.demo.controller;

import com.example.demo.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/chat")
public class ChatController {

    private final String ADMIN_ID = "admin";
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/sendMessage")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        if (chatMessage.getSenderId().equals(ADMIN_ID)) {
            messagingTemplate.convertAndSend("/msg/" + chatMessage.getRecipientId(), chatMessage);
        } else {
            messagingTemplate.convertAndSend("/msg/admin", chatMessage);
        }
    }

    @MessageMapping("/typing")
    public void notifyTyping(@Payload ChatMessage chatMessage) {
        if (chatMessage.getSenderId().equals(ADMIN_ID)) {
            messagingTemplate.convertAndSend("/notify/typing", chatMessage);
        } else {
            messagingTemplate.convertAndSend("/notify/admin/typing", chatMessage);
        }
    }

    @MessageMapping("/read")
    public void notifyRead(@Payload ChatMessage chatMessage) {
        if (chatMessage.getSenderId().equals(ADMIN_ID)) {
            messagingTemplate.convertAndSend("/notify/read", chatMessage);
        } else {
            messagingTemplate.convertAndSend("/notify/admin/read", chatMessage);
        }
    }

}
