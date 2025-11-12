package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.code.model.User;
import project.code.services.PaymentMethodService;
import project.code.dto.payment.CreatePaymentMethodRequest;
import project.code.dto.payment.PaymentMethodDto;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment-methods")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EVDRIVER')")
public class PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<PaymentMethodDto>> getAllPaymentMethods() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(paymentMethodService.getAllPaymentMethods(currentUser));
    }

    @GetMapping("/{methodId}")
    public ResponseEntity<?> getPaymentMethodById(@PathVariable Long methodId) {
        User currentUser = getCurrentUser();
        Optional<PaymentMethodDto> paymentMethod = paymentMethodService.getPaymentMethodById(methodId, currentUser);
        return paymentMethod.isPresent() ? ResponseEntity.ok(paymentMethod.get())
                : ResponseEntity.status(404).body("Không tìm thấy phương thức thanh toán");
    }

    @PostMapping
    public ResponseEntity<PaymentMethodDto> createPaymentMethod(
            @Valid @RequestBody CreatePaymentMethodRequest request) {
        User currentUser = getCurrentUser();
        return ResponseEntity.status(201).body(paymentMethodService.createPaymentMethod(request, currentUser));
    }

    @DeleteMapping("/{methodId}")
    public ResponseEntity<String> deletePaymentMethod(@PathVariable Long methodId) {
        User currentUser = getCurrentUser();
        boolean deleted = paymentMethodService.deletePaymentMethod(methodId, currentUser);
        return deleted ? ResponseEntity.ok("Đã xoá phương thức thanh toán thành công")
                : ResponseEntity.status(404).body("Không tìm thấy phương thức thanh toán để xoá");
    }

    @PostMapping("/{methodId}/set-default")
    public ResponseEntity<String> setDefaultPaymentMethod(@PathVariable Long methodId) {
        User currentUser = getCurrentUser();
        boolean success = paymentMethodService.setDefaultPaymentMethod(methodId, currentUser);
        return success ? ResponseEntity.ok("Đã đặt làm phương thức mặc định thành công")
                : ResponseEntity.status(404).body("Không tìm thấy phương thức thanh toán để đặt mặc định");
    }

    // Hàm Helper
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || !(authentication.getPrincipal() instanceof User)) {
            throw new RuntimeException("Không thể xác định người dùng đang đăng nhập.");
        }
        return (User) authentication.getPrincipal();
    }
}