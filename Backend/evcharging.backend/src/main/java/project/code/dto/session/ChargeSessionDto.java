package project.code.dto.session;

import project.code.model.enums.SessionStatus;
import java.time.LocalDateTime;

public record ChargeSessionDto(
        Long sessionId,
        Long driverId,
        Long vehicleId,
        Long chargingPointId,
        Long stationId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        double energyUsed,
        double cost,
        SessionStatus status
) {}