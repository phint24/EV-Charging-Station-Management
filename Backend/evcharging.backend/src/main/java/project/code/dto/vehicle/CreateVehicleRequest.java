package project.code.dto.vehicle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import project.code.model.enums.ConnectorType; // Import Enum

public record CreateVehicleRequest(
        @NotBlank(message = "Vehicle ID (biển số) không được để trống")
        String vehicleId,

        @NotBlank(message = "Hãng xe không được để trống")
        String brand,

        @NotBlank(message = "Mẫu xe không được để trống")
        String model,

        @Positive(message = "Dung lượng pin phải là số dương")
        double batteryCapacity,

        @NotNull(message = "Loại cổng sạc không được để trống")
        ConnectorType connectorType
) {}