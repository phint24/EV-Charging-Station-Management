package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.PaymentMethod;
import project.code.services.PaymentMethodService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment-methods")
@CrossOrigin(origins = "*")
public class PaymentMethodController {

    @Autowired
    private PaymentMethodService paymentMethodService;

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getAllPaymentMethods() {
        return ResponseEntity.ok(paymentMethodService.getAllPaymentMethods());
    }

    @GetMapping("/{methodId}")
    public ResponseEntity<?> getPaymentMethodById(@PathVariable String methodId) {
        Optional<PaymentMethod> paymentMethod = paymentMethodService.getPaymentMethodById(methodId);
        return paymentMethod.isPresent() ? ResponseEntity.ok(paymentMethod.get())
                : ResponseEntity.status(404).body("Không tìm thấy phương thức thanh toán");
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> createPaymentMethod(@RequestBody PaymentMethod paymentMethod) {
        return ResponseEntity.status(201).body(paymentMethodService.createPaymentMethod(paymentMethod));
    }

    @PutMapping("/{methodId}")
    public ResponseEntity<?> updatePaymentMethod(@PathVariable String methodId, @RequestBody PaymentMethod paymentMethod) {
        PaymentMethod updated = paymentMethodService.updatePaymentMethod(methodId, paymentMethod);
        return updated != null ? ResponseEntity.ok(updated)
                : ResponseEntity.status(404).body("Không tìm thấy phương thức thanh toán để cập nhật");
    }

    @DeleteMapping("/{methodId}")
    public ResponseEntity<String> deletePaymentMethod(@PathVariable String methodId) {
        boolean deleted = paymentMethodService.deletePaymentMethod(methodId);
        return deleted ? ResponseEntity.ok("Đã xoá phương thức thanh toán thành công")
                : ResponseEntity.status(404).body("Không tìm thấy phương thức thanh toán để xoá");
    }

    @PostMapping("/{methodId}/set-default")
    public ResponseEntity<String> setDefaultPaymentMethod(@PathVariable String methodId) {
        boolean success = paymentMethodService.setDefaultPaymentMethod(methodId);
        return success ? ResponseEntity.ok("Đã đặt làm phương thức mặc định thành công")
                : ResponseEntity.status(404).body("Không tìm thấy phương thức thanh toán để đặt mặc định");
    }
}