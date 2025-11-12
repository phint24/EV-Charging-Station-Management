package project.code.dto.invoice;

import jakarta.validation.constraints.NotNull;

public record PayInvoiceRequest(
        @NotNull(message = "ID Phương thức thanh toán không được để trống")
        Long paymentMethodId
) {}