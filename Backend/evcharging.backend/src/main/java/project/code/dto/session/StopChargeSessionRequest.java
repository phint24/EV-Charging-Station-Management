package project.code.dto.session;

import jakarta.validation.constraints.NotNull;

public record StopChargeSessionRequest(
        @NotNull(message = "Năng lượng đã dùng không được để trống")
        Double energyUsed
) {}