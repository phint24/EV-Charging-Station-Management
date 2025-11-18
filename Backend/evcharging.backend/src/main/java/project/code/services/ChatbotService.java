package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import project.code.model.EVDriver;
import project.code.model.ChatHistory;
import project.code.model.User;
import project.code.repository.ChatHistoryRepository;
import project.code.repository.EVDriverRepository;
import project.code.dto.chatbot.ChatHistoryDto;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotService {

    private final ChatHistoryRepository chatHistoryRepository;
    private final EVDriverRepository evDriverRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String MODEL = "gemini-2.0-flash";

    @Transactional
    public String chat(User currentUser, String userMessage) {
        EVDriver driver = evDriverRepository.findByUserAccount(currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ EVDriver"));

        // Lấy lịch sử chat gần đây (20 tin nhắn cuối)
        List<ChatHistory> recentHistory = chatHistoryRepository
                .findTop20ByDriverOrderByTimestampDesc(driver);

        // Xây dựng context từ lịch sử
        List<Map<String, String>> messages = buildMessagesWithHistory(recentHistory, userMessage);

        // Gọi Gemini API
        String botResponse = callGeminiAPI(messages, driver);

        // Lưu vào database
        ChatHistory chatHistory = ChatHistory.builder()
                .driver(driver)
                .userMessage(userMessage)
                .botResponse(botResponse)
                .build();
        chatHistoryRepository.save(chatHistory);

        return botResponse;
    }

    private List<Map<String, String>> buildMessagesWithHistory(
            List<ChatHistory> history, String currentMessage) {
        
        List<Map<String, String>> messages = new ArrayList<>();

        // Thêm lịch sử (đảo ngược để đúng thứ tự thời gian)
        for (int i = history.size() - 1; i >= 0; i--) {
            ChatHistory chat = history.get(i);
            messages.add(Map.of("role", "user", "content", chat.getUserMessage()));
            messages.add(Map.of("role", "assistant", "content", chat.getBotResponse()));
        }

        // Thêm tin nhắn hiện tại
        messages.add(Map.of("role", "user", "content", currentMessage));

        return messages;
    }

    private String callGeminiAPI(List<Map<String, String>> messages, EVDriver driver) {
        try {
            // ✅ URL đầy đủ với API key trong query param
            String apiUrl = String.format(
                "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                MODEL,
                geminiApiKey
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Chuyển đổi messages sang format Gemini
            List<Map<String, Object>> geminiContents = convertToGeminiFormat(messages, driver);

            Map<String, Object> requestBody = Map.of("contents", geminiContents);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);

            // Parse response của Gemini
            JsonNode jsonResponse = objectMapper.readTree(response.getBody());
            return jsonResponse.get("candidates").get(0)
                    .get("content").get("parts").get(0)
                    .get("text").asText();

        } catch (Exception e) {
            System.err.println("Gemini API Error: " + e.getMessage());
            throw new RuntimeException("Lỗi khi gọi Gemini API: " + e.getMessage());
        }
    }

    private List<Map<String, Object>> convertToGeminiFormat(
            List<Map<String, String>> messages, EVDriver driver) {
        
        List<Map<String, Object>> geminiContents = new ArrayList<>();
        
        // Thêm system prompt vào đầu
        String systemPrompt = buildSystemPrompt(driver);
        geminiContents.add(Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", systemPrompt))
        ));
        geminiContents.add(Map.of(
            "role", "model",
            "parts", List.of(Map.of("text", "Tôi hiểu. Tôi sẽ hỗ trợ bạn với vai trò trợ lý AI cho ứng dụng sạc xe điện."))
        ));
        
        // Chuyển đổi lịch sử chat
        for (Map<String, String> message : messages) {
            String role = message.get("role");
            String content = message.get("content");
            
            // Gemini dùng "model" thay vì "assistant"
            String geminiRole = role.equals("assistant") ? "model" : "user";
            
            geminiContents.add(Map.of(
                "role", geminiRole,
                "parts", List.of(Map.of("text", content))
            ));
        }
        
        return geminiContents;
    }

    private String buildSystemPrompt(EVDriver driver) {
        return String.format("""
            Bạn là trợ lý AI thông minh cho ứng dụng sạc xe điện EV Charging Station.
            
            Thông tin người dùng hiện tại:
            - Tên: %s
            - Email: %s
            - Số dư ví: %.2f VNĐ
            - Số lượng xe: %d
            
            Nhiệm vụ của bạn:
            1. Trả lời các câu hỏi về hệ thống sạc xe điện
            2. Hướng dẫn sử dụng các tính năng của ứng dụng
            3. Cung cấp thông tin về trạm sạc, giá cả, thời gian sạc
            4. Giải đáp thắc mắc về ví điện tử, thanh toán
            5. Hỗ trợ đặt lịch sạc xe
            
            Hãy trả lời bằng tiếng Việt, thân thiện, ngắn gọn và hữu ích.
            Nếu không chắc chắn về thông tin, hãy khuyên người dùng liên hệ bộ phận hỗ trợ.
            """,
                driver.getUserAccount().getName(),
                driver.getUserAccount().getEmail(),
                driver.getWalletBalance(),
                driver.getVehicles() != null ? driver.getVehicles().size() : 0
        );
    }

    @Transactional(readOnly = true)
    public List<ChatHistoryDto> getChatHistory(User currentUser) {
        EVDriver driver = evDriverRepository.findByUserAccount(currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ EVDriver"));

        return chatHistoryRepository.findByDriverOrderByTimestampDesc(driver)
                .stream()
                .map(chat -> new ChatHistoryDto(
                        chat.getId(),
                        chat.getUserMessage(),
                        chat.getBotResponse(),
                        chat.getTimestamp()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void clearChatHistory(User currentUser) {
        EVDriver driver = evDriverRepository.findByUserAccount(currentUser)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ EVDriver"));

        List<ChatHistory> history = chatHistoryRepository.findByDriverOrderByTimestampDesc(driver);
        chatHistoryRepository.deleteAll(history);
    }
}