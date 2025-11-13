package project.code.dto.report;

import project.code.model.enums.ReportType;
import java.time.LocalDateTime;

public record ReportDto(
        Long reportId,
        ReportType reportType,
        Long stationId,
        LocalDateTime periodStart,
        LocalDateTime periodEnd,
        int totalSessions,
        double totalEnergy,
        double totalRevenue
) { }