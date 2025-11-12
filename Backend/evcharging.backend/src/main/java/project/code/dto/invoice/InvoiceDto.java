package project.code.dto.invoice;

import project.code.model.enums.InvoiceStatus;
import java.time.LocalDateTime;

public record InvoiceDto(
        Long invoiceId,
        Long chargeSessionId,
        Long driverId,
        LocalDateTime issueDate,
        double totalEnergy,
        double amount,
        Long paymentMethodId,
        InvoiceStatus status
) {}