package com.example.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private String senderId;
    private String recipientId;
    private String content;
    private String readStatus;
}
