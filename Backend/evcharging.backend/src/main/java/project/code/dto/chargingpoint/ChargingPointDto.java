package project.code.dto.chargingpoint;

import project.code.model.enums.ChargingPointStatus;
import project.code.model.enums.ConnectorType;

public record ChargingPointDto(
        Long chargingPointId,
        Long stationId,
        ConnectorType type,
        double power,
        ChargingPointStatus status
) {}