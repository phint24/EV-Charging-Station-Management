package project.code.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import project.code.model.enums.PaymentType;

public record CreatePaymentMethodRequest(

        @NotNull(message = "ID Tài xế không được để trống")
        Long driverId,
        @NotNull(message = "Loại thanh toán không được để trống")
        PaymentType type,
        @NotBlank(message = "Nhà cung cấp không được để trống")
        String provider,
        @NotBlank(message = "ID phương thức không được để trống")
        Long methodId,
        boolean isDefault
) {}