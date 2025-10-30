package project.code.dto.session;

import jakarta.validation.constraints.NotNull;

public record CreateChargeSessionRequest(

        @NotNull(message = "ID Tài xế không được để trống")
        Long driverId,

        @NotNull(message = "ID Xe không được để trống")
        Long vehicleId,

        @NotNull(message = "ID Điểm sạc không được để trống")
        Long chargingPointId
) {}