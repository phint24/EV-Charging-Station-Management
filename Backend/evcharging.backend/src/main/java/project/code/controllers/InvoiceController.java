package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.Invoice;
import project.code.services.InvoiceService;
import project.code.dto.PayInvoiceRequest;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/{invoiceId}")
    public ResponseEntity<?> getInvoiceById(@PathVariable Long invoiceId) {
        Optional<Invoice> invoice = invoiceService.getInvoiceById(invoiceId);
        return invoice.isPresent() ? ResponseEntity.ok(invoice.get())
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn");
    }

    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<String> deleteInvoice(@PathVariable Long invoiceId) {
        boolean deleted = invoiceService.deleteInvoice(invoiceId);
        return deleted ? ResponseEntity.ok("Đã xoá hóa đơn thành công")
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn để xoá");
    }

    @PostMapping("/{invoiceId}/pay")
    public ResponseEntity<?> payInvoice(
            @PathVariable Long invoiceId,
            @Valid @RequestBody PayInvoiceRequest request) {

        try {
            Invoice paidInvoice = invoiceService.payInvoice(invoiceId, request.paymentMethodId());
            return ResponseEntity.ok(paidInvoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}