package project.code.dto.booking;
import project.code.model.enums.BookingStatus;
import java.time.LocalDateTime;

public record BookingDto(
        Long id,
        Long driverId,
        Long chargingPointId,
        String stationName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        BookingStatus status
) {}