package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import project.code.model.User;
import project.code.services.InvoiceService;

import project.code.dto.invoice.InvoiceDto;
import project.code.dto.invoice.PayInvoiceRequest;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EVDRIVER')")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceDto>> getAllInvoices() {
        User currentUser = getCurrentUser();
        return ResponseEntity.ok(invoiceService.getAllInvoices(currentUser));
    }

    @GetMapping("/{invoiceId}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long invoiceId) {
        User currentUser = getCurrentUser();
        Optional<InvoiceDto> invoice = invoiceService.getInvoiceById(invoiceId, currentUser);
        return invoice.isPresent() ? ResponseEntity.ok(invoice.get())
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn");
    }

    @PostMapping("/{invoiceId}/pay")
    public ResponseEntity<?> payInvoice(
            @PathVariable Long invoiceId,
            @Valid @RequestBody PayInvoiceRequest request) {

        User currentUser = getCurrentUser();
        try {
            InvoiceDto paidInvoice = invoiceService.payInvoice(invoiceId, request.paymentMethodId(), currentUser);
            return ResponseEntity.ok(paidInvoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{invoiceId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInvoice(@PathVariable Long invoiceId) {
        boolean deleted = invoiceService.deleteInvoice(invoiceId);
        return deleted ? ResponseEntity.ok("Đã xoá hóa đơn thành công")
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn để xoá");
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