package project.code.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.Report;
import project.code.dto.GenerateReportRequest;
import project.code.model.enums.ReportType;
import jakarta.validation.Valid;

import project.code.services.ReportService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // Lấy tất cả reports
    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReportById(@PathVariable Long reportId) {
        Optional<Report> report = reportService.getReportById(reportId);
        return report.isPresent()
                ? ResponseEntity.ok(report.get())
                : ResponseEntity.status(404).body("Không tìm thấy report với ID: " + reportId);
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable Long reportId) {
        boolean deleted = reportService.deleteReport(reportId);
        return deleted
                ? ResponseEntity.ok("Đã xóa report thành công")
                : ResponseEntity.status(404).body("Không tìm thấy report để xóa");
    }

    // Lấy reports theo stationId
    @GetMapping("/station/{stationId}")
    public ResponseEntity<List<Report>> getReportsByStation(@PathVariable Long stationId) {
        return ResponseEntity.ok(reportService.getReportsByStationId(stationId));
    }

    @GetMapping("/type/{reportType}")
    public ResponseEntity<List<Report>> getReportsByType(@PathVariable ReportType reportType) {
        return ResponseEntity.ok(reportService.getReportsByType(reportType));
    }

    // Lấy reports theo khoảng thời gian
    @GetMapping("/period")
    public ResponseEntity<List<Report>> getReportsByPeriod(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(reportService.getReportsByPeriod(start, end));
    }

    // Lấy reports theo station và khoảng thời gian
    @GetMapping("/station/{stationId}/period")
    public ResponseEntity<List<Report>> getReportsByStationAndPeriod(
            @PathVariable Long stationId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(reportService.getReportsByStationAndPeriod(stationId, start, end));
    }

    @PostMapping("/revenue")
    public ResponseEntity<?> generateRevenueReport(
            @Valid @RequestBody GenerateReportRequest request) {
        try {
            Report report = reportService.generateReport(request, ReportType.REVENUE);
            return ResponseEntity.status(201).body(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/usage")
    public ResponseEntity<?> generateUsageReport(
            @Valid @RequestBody GenerateReportRequest request) {
        try {
            Report report = reportService.generateReport(request, ReportType.USAGE);
            return ResponseEntity.status(201).body(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/top-revenue")
    public ResponseEntity<?> getTopRevenueReport() {
        Optional<Report> report = reportService.getTopRevenueReport();
        return report.isPresent()
                ? ResponseEntity.ok(report.get())
                : ResponseEntity.status(404).body("Không có report nào");
    }

    @GetMapping("/top-energy")
    public ResponseEntity<?> getTopEnergyReport() {
        Optional<Report> report = reportService.getTopEnergyReport();
        return report.isPresent()
                ? ResponseEntity.ok(report.get())
                : ResponseEntity.status(404).body("Không có report nào");
    }

    @GetMapping("/sorted")
    public ResponseEntity<List<Report>> getAllReportsSorted() {
        return ResponseEntity.ok(reportService.getAllReportsSortedByDate());
    }

    @GetMapping("/min-sessions/{minSessions}")
    public ResponseEntity<List<Report>> getReportsByMinSessions(@PathVariable int minSessions) {
        return ResponseEntity.ok(reportService.getReportsByMinSessions(minSessions));
    }

    @GetMapping("/revenue-range")
    public ResponseEntity<List<Report>> getReportsByRevenueRange(
            @RequestParam double minRevenue,
            @RequestParam double maxRevenue) {
        return ResponseEntity.ok(reportService.getReportsByRevenueRange(minRevenue, maxRevenue));
    }
}