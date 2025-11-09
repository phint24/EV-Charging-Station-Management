package project.code.dto;

import project.code.model.ChargingStation.StationStatus;

public record StationSummaryDto(
        Long stationId,
        String name,
        String location,
        StationStatus status
) {}