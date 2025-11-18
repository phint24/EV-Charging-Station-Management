package project.code.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.code.dto.chatbot.ChatMessageRequest;
import project.code.dto.chatbot.ChatMessageResponse;
import project.code.dto.chatbot.ChatHistoryDto;
import project.code.model.User;
import project.code.services.ChatbotService;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EVDRIVER')")
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<ChatMessageResponse> sendMessage(
            @Valid @RequestBody ChatMessageRequest request) {
        User currentUser = getCurrentUser();
        
        String response = chatbotService.chat(currentUser, request.message());
        
        return ResponseEntity.ok(new ChatMessageResponse(
                response,
                System.currentTimeMillis()
        ));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatHistoryDto>> getChatHistory() {
        User currentUser = getCurrentUser();
        List<ChatHistoryDto> history = chatbotService.getChatHistory(currentUser);
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history")
    public ResponseEntity<Void> clearChatHistory() {
        User currentUser = getCurrentUser();
        chatbotService.clearChatHistory(currentUser);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() 
                || !(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("Không thể xác định người dùng đang đăng nhập.");
        }
        return (User) authentication.getPrincipal();
    }
}