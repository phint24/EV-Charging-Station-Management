package project.code.dto.wallet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record WalletTopUpRequest(

        @NotNull(message = "Số tiền không được để trống")
        @Positive(message = "Số tiền nạp phải là số dương")
        Double amount,

        @NotNull(message = "ID phương thức thanh toán không được để trống")
        Long paymentMethodId
) {
}