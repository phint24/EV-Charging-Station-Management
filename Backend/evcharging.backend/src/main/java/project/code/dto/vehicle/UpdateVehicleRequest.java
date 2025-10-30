package project.code.dto.vehicle;

import jakarta.validation.constraints.Positive;
import project.code.model.enums.ConnectorType;

public record UpdateVehicleRequest(
        String brand,
        String model,

        @Positive(message = "Dung lượng pin phải là số dương")
        Double batteryCapacity,

        ConnectorType connectorType
) {}