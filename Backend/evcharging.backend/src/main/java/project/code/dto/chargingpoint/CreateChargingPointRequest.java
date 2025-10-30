package project.code.dto.chargingpoint;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import project.code.model.enums.ChargingPointStatus;
import project.code.model.enums.ConnectorType;

public record CreateChargingPointRequest(
        @NotNull(message = "ID Trạm sạc không được để trống")
        Long stationId, // ID của ChargingStation (Long)

        @NotNull
        ConnectorType type,

        @Positive
        double power,

        @NotNull
        ChargingPointStatus status
) {}