package project.code.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.Invoice;
import project.code.repository.InvoiceRepository;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Optional<Invoice> getInvoiceById(String invoiceId) {
        return invoiceRepository.findById(invoiceId);
    }

    public Invoice createInvoice(Invoice invoice) {
        invoice.setIssueDate(java.time.LocalDateTime.now()); // Set current time as issue date
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(String invoiceId, Invoice updatedInvoice) {
        return invoiceRepository.findById(invoiceId)
                .map(invoice -> {
                    invoice.setSessionId(updatedInvoice.getSessionId());
                    invoice.setDriverId(updatedInvoice.getDriverId());
                    invoice.setIssueDate(updatedInvoice.getIssueDate());
                    invoice.setTotalEnergy(updatedInvoice.getTotalEnergy());
                    invoice.setAmount(updatedInvoice.getAmount());
                    invoice.setPaymentMethod(updatedInvoice.getPaymentMethod());
                    invoice.setStatus(updatedInvoice.getStatus());
                    return invoiceRepository.save(invoice);
                }).orElse(null);
    }

    public boolean deleteInvoice(String invoiceId) {
        if (invoiceRepository.existsById(invoiceId)) {
            invoiceRepository.deleteById(invoiceId);
            return true;
        }
        return false;
    }

    public boolean generateInvoice(String invoiceId, String session) {
        Optional<Invoice> optionalInvoice = invoiceRepository.findById(invoiceId);
        if (optionalInvoice.isPresent()) {
            Invoice invoice = optionalInvoice.get();
            // Logic to generate invoice based on session (simplified)
            invoice.setStatus("GENERATED");
            invoiceRepository.save(invoice);
            return true;
        }
        return false;
    }

    public Optional<String> getInvoiceInfo(String invoiceId) {
        return invoiceRepository.findById(invoiceId)
                .map(invoice -> invoice.getInvoiceInfo());
    }
}