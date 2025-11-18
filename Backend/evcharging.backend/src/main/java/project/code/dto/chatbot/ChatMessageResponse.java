package project.code.dto.chatbot;

public record ChatMessageResponse(
    String response,
    long timestamp
) {}
