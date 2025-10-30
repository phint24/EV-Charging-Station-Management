package project.code.dto.chargingpoint;

import jakarta.validation.constraints.Positive;
import project.code.model.enums.ChargingPointStatus;
import project.code.model.enums.ConnectorType;

public record UpdateChargingPointRequest(
        ConnectorType type,
        @Positive Double power,
        ChargingPointStatus status
) {}