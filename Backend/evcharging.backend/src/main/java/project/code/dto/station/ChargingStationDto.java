package project.code.dto.station;

import project.code.model.ChargingStation.StationStatus;

public record ChargingStationDto(

        Long stationId,
        String name,
        String location,
        StationStatus status,
        int totalChargingPoint,
        int availableChargers

) {
}