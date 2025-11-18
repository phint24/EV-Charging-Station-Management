package project.code.dto.chatbot;

import java.time.LocalDateTime;

public record ChatHistoryDto(
    Long id,
    String userMessage,
    String botResponse,
    LocalDateTime timestamp
) {}
