package project.code.dto;

import jakarta.validation.constraints.NotBlank;

public record PayInvoiceRequest(

        @NotBlank(message = "ID phương thức thanh toán không được để trống")
        String paymentMethodId
) {}