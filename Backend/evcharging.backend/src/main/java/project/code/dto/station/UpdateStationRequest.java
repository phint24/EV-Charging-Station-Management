package project.code.dto.station;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import project.code.model.ChargingStation.StationStatus;

public record UpdateStationRequest(

        @NotBlank(message = "Tên trạm không được để trống")
        String name,

        @NotBlank(message = "Vị trí không được để trống")
        String location,

        @NotNull(message = "Trạng thái không được để trống")
        StationStatus status,

        @NotNull
        Integer totalChargingPoint,

        @NotNull
        Integer availableChargers
) {}