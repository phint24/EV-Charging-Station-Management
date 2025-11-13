package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import project.code.model.enums.ReportType;
import project.code.services.ReportService;
import project.code.dto.report.GenerateReportRequest;
import project.code.dto.report.ReportDto;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<ReportDto>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportDto> getReportById(@PathVariable Long reportId) {
        return reportService.getReportById(reportId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable Long reportId) {
        boolean deleted = reportService.deleteReport(reportId);
        return deleted
                ? ResponseEntity.ok("Đã xóa report thành công")
                : ResponseEntity.status(404).body("Không tìm thấy report để xóa");
    }

    @GetMapping("/station/{stationId}")
    public ResponseEntity<List<ReportDto>> getReportsByStation(@PathVariable Long stationId) {
        return ResponseEntity.ok(reportService.getReportsByStationId(stationId));
    }

    @GetMapping("/type/{reportType}")
    public ResponseEntity<List<ReportDto>> getReportsByType(@PathVariable ReportType reportType) {
        return ResponseEntity.ok(reportService.getReportsByType(reportType));
    }

    @GetMapping("/period")
    public ResponseEntity<List<ReportDto>> getReportsByPeriod(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(reportService.getReportsByPeriod(start, end));
    }

    @GetMapping("/station/{stationId}/period")
    public ResponseEntity<List<ReportDto>> getReportsByStationAndPeriod(
            @PathVariable Long stationId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(reportService.getReportsByStationAndPeriod(stationId, start, end));
    }

    @PostMapping("/revenue")
    public ResponseEntity<ReportDto> generateRevenueReport(
            @Valid @RequestBody GenerateReportRequest request) {
        try {
            ReportDto report = reportService.generateReport(request, ReportType.REVENUE);
            return ResponseEntity.status(201).body(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Trả về null hoặc DTO lỗi
        }
    }

    @PostMapping("/usage")
    public ResponseEntity<ReportDto> generateUsageReport(
            @Valid @RequestBody GenerateReportRequest request) {
        try {
            ReportDto report = reportService.generateReport(request, ReportType.USAGE);
            return ResponseEntity.status(201).body(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null); // Trả về null hoặc DTO lỗi
        }
    }

    @GetMapping("/top-revenue")
    public ResponseEntity<ReportDto> getTopRevenueReport() {
        return reportService.getTopRevenueReport()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/top-energy")
    public ResponseEntity<ReportDto> getTopEnergyReport() {
        return reportService.getTopEnergyReport()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sorted")
    public ResponseEntity<List<ReportDto>> getAllReportsSorted() {
        return ResponseEntity.ok(reportService.getAllReportsSortedByDate());
    }

    @GetMapping("/min-sessions/{minSessions}")
    public ResponseEntity<List<ReportDto>> getReportsByMinSessions(@PathVariable int minSessions) {
        return ResponseEntity.ok(reportService.getReportsByMinSessions(minSessions));
    }

    @GetMapping("/revenue-range")
    public ResponseEntity<List<ReportDto>> getReportsByRevenueRange(
            @RequestParam double minRevenue,
            @RequestParam double maxRevenue) {
        return ResponseEntity.ok(reportService.getReportsByRevenueRange(minRevenue, maxRevenue));
    }
}