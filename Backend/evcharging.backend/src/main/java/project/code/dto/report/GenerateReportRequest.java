package project.code.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record GenerateReportRequest(

        @NotBlank(message = "ID Trạm không được để trống")
        Long stationId,

        @NotNull(message = "Ngày bắt đầu không được để trống")
        LocalDateTime periodStart,

        @NotNull(message = "Ngày kết thúc không được để trống")
        LocalDateTime periodEnd
) {}