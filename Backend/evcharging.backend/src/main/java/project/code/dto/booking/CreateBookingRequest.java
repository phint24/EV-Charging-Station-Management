package project.code.dto.booking;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Future;
import java.time.LocalDateTime;

public record CreateBookingRequest(
        @NotNull Long chargingPointId,
        @NotNull @Future(message = "Thời gian bắt đầu phải ở tương lai") LocalDateTime startTime,
        @NotNull @Future LocalDateTime endTime
) {}