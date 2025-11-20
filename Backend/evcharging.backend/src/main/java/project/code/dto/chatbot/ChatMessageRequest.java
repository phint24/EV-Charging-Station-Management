package project.code.dto.chatbot;

import jakarta.validation.constraints.NotBlank;

public record ChatMessageRequest(
    @NotBlank(message = "Message không được để trống")
    String message
) {}
