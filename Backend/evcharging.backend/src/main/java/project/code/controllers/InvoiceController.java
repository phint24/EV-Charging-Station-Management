package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.Invoice;
import project.code.services.InvoiceService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/{invoiceId}")
    public ResponseEntity<?> getInvoiceById(@PathVariable String invoiceId) {
        Optional<Invoice> invoice = invoiceService.getInvoiceById(invoiceId);
        return invoice.isPresent() ? ResponseEntity.ok(invoice.get())
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn");
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return ResponseEntity.status(201).body(invoiceService.createInvoice(invoice));
    }

    @PutMapping("/{invoiceId}")
    public ResponseEntity<?> updateInvoice(@PathVariable String invoiceId, @RequestBody Invoice invoice) {
        Invoice updated = invoiceService.updateInvoice(invoiceId, invoice);
        return updated != null ? ResponseEntity.ok(updated)
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn để cập nhật");
    }

    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<String> deleteInvoice(@PathVariable String invoiceId) {
        boolean deleted = invoiceService.deleteInvoice(invoiceId);
        return deleted ? ResponseEntity.ok("Đã xoá hóa đơn thành công")
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn để xoá");
    }

    @PostMapping("/{invoiceId}/generate")
    public ResponseEntity<String> generateInvoice(@PathVariable String invoiceId, @RequestParam String session) {
        boolean success = invoiceService.generateInvoice(invoiceId, session);
        return success ? ResponseEntity.ok("Đã tạo hóa đơn thành công")
                : ResponseEntity.status(404).body("Không tìm thấy hóa đơn để tạo");
    }

    @GetMapping("/{invoiceId}/info")
    public ResponseEntity<String> getInvoiceInfo(@PathVariable String invoiceId) {
        Optional<String> info = invoiceService.getInvoiceInfo(invoiceId);
        return info.isPresent() ? ResponseEntity.ok(info.get())
                : ResponseEntity.status(404).body("Không tìm thấy thông tin hóa đơn");
    }
}