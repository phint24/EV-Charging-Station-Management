package project.code.dto.vehicle;

import project.code.model.enums.ConnectorType;

public record VehicleDto(
        Long id,
        String vehicleId,
        String brand,
        String model,
        double batteryCapacity,
        ConnectorType connectorType
) {}