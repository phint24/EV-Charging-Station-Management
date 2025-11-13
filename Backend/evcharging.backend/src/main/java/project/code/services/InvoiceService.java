package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.ChargeSession;
import project.code.model.EVDriver;
import project.code.model.Invoice;
import project.code.model.PaymentMethod;
import project.code.model.User;
import project.code.model.enums.InvoiceStatus;
import project.code.repository.EVDriverRepository;
import project.code.repository.InvoiceRepository;
import project.code.repository.PaymentMethodRepository;
import project.code.dto.invoice.InvoiceDto;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final EVDriverRepository evDriverRepository;

    @Transactional(readOnly = true)
    public List<InvoiceDto> getAllInvoices(User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);
        return invoiceRepository.findByDriver(driver)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<InvoiceDto> getInvoiceById(Long invoiceId, User currentUser) {
        EVDriver driver = findDriverProfileByUser(currentUser);
        Invoice invoice = findInvoiceByIdOrThrow(invoiceId);

        if (!invoice.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xem hóa đơn này.");
        }

        return Optional.of(mapToDto(invoice));
    }

    @Transactional
    public InvoiceDto generateInvoiceForSession(ChargeSession completedSession) {
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
                .status(InvoiceStatus.PAID)
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToDto(savedInvoice);
    }

    @Transactional
    public InvoiceDto payInvoice(Long invoiceId, Long paymentMethodId, User currentUser) {

        Invoice invoice = findInvoiceByIdOrThrow(invoiceId);
        EVDriver driver = findDriverProfileByUser(currentUser);

        if (!invoice.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn không có quyền thanh toán hóa đơn này.");
        }

        PaymentMethod paymentMethod = paymentMethodRepository.findById(paymentMethodId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy phương thức thanh toán: " + paymentMethodId));

        if (!paymentMethod.getDriver().getId().equals(driver.getId())) {
            throw new AccessDeniedException("Bạn không có quyền dùng phương thức thanh toán này.");
        }

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new IllegalStateException("Hóa đơn này đã được thanh toán.");
        }

        invoice.setPaymentMethod(paymentMethod);
        invoice.setStatus(InvoiceStatus.PAID);

        Invoice savedInvoice = invoiceRepository.save(invoice);
        return mapToDto(savedInvoice);
    }

    @Transactional
    public boolean deleteInvoice(Long invoiceId) {
        if (invoiceRepository.existsById(invoiceId)) {
            invoiceRepository.deleteById(invoiceId);
            return true;
        }
        return false;
    }

    // --- Helper Methods ---
    private EVDriver findDriverProfileByUser(User user) {
        return evDriverRepository.findByUserAccount(user)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy hồ sơ EVDriver cho người dùng: " + user.getEmail()));
    }

    private Invoice findInvoiceByIdOrThrow(Long invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn: " + invoiceId));
    }

    private InvoiceDto mapToDto(Invoice invoice) {
        return new InvoiceDto(
                invoice.getInvoiceId(),
                invoice.getChargeSession().getSessionId(),
                invoice.getDriver().getId(),
                invoice.getIssueDate(),
                invoice.getTotalEnergy(),
                invoice.getAmount(),
                invoice.getPaymentMethod() != null ? invoice.getPaymentMethod().getMethodId() : null,
                invoice.getStatus()
        );
    }
}