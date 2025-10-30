package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.*;
import project.code.model.enums.InvoiceStatus;
import project.code.repository.InvoiceRepository;
import project.code.repository.PaymentMethodRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(Long invoiceId) {
        return invoiceRepository.findById(invoiceId);
    }

    @Transactional
    public Invoice generateInvoiceForSession(ChargeSession completedSession) {

        if(invoiceRepository.findByChargeSession(completedSession).isPresent()) {
            throw new IllegalStateException("Hóa đơn đã tồn tại cho phiên sạc này.");
        }

        if(completedSession.getStatus() != project.code.model.enums.SessionStatus.COMPLETED) {
            throw new IllegalStateException("Chỉ có thể tạo hóa đơn cho phiên sạc đã hoàn thành.");
        }

        Invoice invoice = Invoice.builder()
                .chargeSession(completedSession)
                .driver(completedSession.getDriver())
                .issueDate(LocalDateTime.now())
                .totalEnergy(completedSession.getEnergyUsed())
                .amount(completedSession.getCost())
                .status(InvoiceStatus.PENDING)
                .build();

        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Invoice payInvoice(Long invoiceId, String paymentMethodId) {
        // 1. Tìm hóa đơn
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn: " + invoiceId));

        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán: " + paymentMethodId));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Hóa đơn này đã được thanh toán.");
        }

        invoice.setPaymentMethod(paymentMethod);
        invoice.setStatus(InvoiceStatus.PAID);
        return invoiceRepository.save(invoice);
    }

    public boolean deleteInvoice(Long invoiceId) {
        if (invoiceRepository.existsById(invoiceId)) {
            invoiceRepository.deleteById(invoiceId);
            return true;
        }
        return false;
    }

    // (8) XÓA BỎ: Các hàm logic nghiệp vụ sai (generateInvoice, getInvoiceInfo)
}