package project.code.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.code.model.Report;
import project.code.services.ReportService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private ReportService reportService;

    // Lấy tất cả reports
    @GetMapping
    public ResponseEntity<List<Report>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // Lấy report theo ID
    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReportById(@PathVariable String reportId) {
        Optional<Report> report = reportService.getReportById(reportId);
        return report.isPresent() 
                ? ResponseEntity.ok(report.get())
                : ResponseEntity.status(404).body("Không tìm thấy report với ID: " + reportId);
    }

    // Tạo mới report
    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody Report report) {
        return ResponseEntity.status(201).body(reportService.createReport(report));
    }

    // Cập nhật report
    @PutMapping("/{reportId}")
    public ResponseEntity<?> updateReport(@PathVariable String reportId, @RequestBody Report report) {
        try {
            Report updated = reportService.updateReport(reportId, report);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Không tìm thấy report để cập nhật");
        }
    }

    // Xóa report
    @DeleteMapping("/{reportId}")
    public ResponseEntity<String> deleteReport(@PathVariable String reportId) {
        boolean deleted = reportService.deleteReport(reportId);
        return deleted 
                ? ResponseEntity.ok("Đã xóa report thành công")
                : ResponseEntity.status(404).body("Không tìm thấy report để xóa");
    }

    // Lấy reports theo stationId
    @GetMapping("/station/{stationId}")
    public ResponseEntity<List<Report>> getReportsByStation(@PathVariable String stationId) {
        return ResponseEntity.ok(reportService.getReportsByStationId(stationId));
    }

    // Lấy reports theo reportType
    @GetMapping("/type/{reportType}")
    public ResponseEntity<List<Report>> getReportsByType(@PathVariable String reportType) {
        return ResponseEntity.ok(reportService.getReportsByType(reportType));
    }

    // Lấy reports theo khoảng thời gian
    @GetMapping("/period")
    public ResponseEntity<List<Report>> getReportsByPeriod(
            @RequestParam String start, 
            @RequestParam String end) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return ResponseEntity.ok(reportService.getReportsByPeriod(startDate, endDate));
    }

    // Lấy reports theo station và khoảng thời gian
    @GetMapping("/station/{stationId}/period")
    public ResponseEntity<List<Report>> getReportsByStationAndPeriod(
            @PathVariable String stationId,
            @RequestParam String start,
            @RequestParam String end) {
        LocalDateTime startDate = LocalDateTime.parse(start);
        LocalDateTime endDate = LocalDateTime.parse(end);
        return ResponseEntity.ok(reportService.getReportsByStationAndPeriod(stationId, startDate, endDate));
    }

    // Tạo báo cáo doanh thu (revenue report)
    @PostMapping("/revenue")
    public ResponseEntity<Report> generateRevenueReport(
            @RequestParam String stationId,
            @RequestParam String periodStart,
            @RequestParam String periodEnd) {
        LocalDateTime start = LocalDateTime.parse(periodStart);
        LocalDateTime end = LocalDateTime.parse(periodEnd);
        Report report = reportService.generateRevenueReport(stationId, start, end);
        return ResponseEntity.status(201).body(report);
    }

    // Tạo báo cáo sử dụng (usage report)
    @PostMapping("/usage")
    public ResponseEntity<Report> generateUsageReport(
            @RequestParam String stationId,
            @RequestParam String periodStart,
            @RequestParam String periodEnd) {
        LocalDateTime start = LocalDateTime.parse(periodStart);
        LocalDateTime end = LocalDateTime.parse(periodEnd);
        Report report = reportService.generateUsageReport(stationId, start, end);
        return ResponseEntity.status(201).body(report);
    }

    // Hiển thị report
    @GetMapping("/{reportId}/display")
    public ResponseEntity<String> displayReport(@PathVariable String reportId) {
        try {
            reportService.displayReport(reportId);
            return ResponseEntity.ok("Đã hiển thị report: " + reportId);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    // Lấy report có doanh thu cao nhất
    @GetMapping("/top-revenue")
    public ResponseEntity<?> getTopRevenueReport() {
        Optional<Report> report = reportService.getTopRevenueReport();
        return report.isPresent()
                ? ResponseEntity.ok(report.get())
                : ResponseEntity.status(404).body("Không có report nào");
    }

    // Lấy report có năng lượng cao nhất
    @GetMapping("/top-energy")
    public ResponseEntity<?> getTopEnergyReport() {
        Optional<Report> report = reportService.getTopEnergyReport();
        return report.isPresent()
                ? ResponseEntity.ok(report.get())
                : ResponseEntity.status(404).body("Không có report nào");
    }

    // Lấy tất cả reports sắp xếp theo thời gian
    @GetMapping("/sorted")
    public ResponseEntity<List<Report>> getAllReportsSorted() {
        return ResponseEntity.ok(reportService.getAllReportsSortedByDate());
    }

    // Lấy reports theo số phiên sạc tối thiểu
    @GetMapping("/min-sessions/{minSessions}")
    public ResponseEntity<List<Report>> getReportsByMinSessions(@PathVariable int minSessions) {
        return ResponseEntity.ok(reportService.getReportsByMinSessions(minSessions));
    }

    // Lấy reports theo khoảng doanh thu
    @GetMapping("/revenue-range")
    public ResponseEntity<List<Report>> getReportsByRevenueRange(
            @RequestParam double minRevenue,
            @RequestParam double maxRevenue) {
        return ResponseEntity.ok(reportService.getReportsByRevenueRange(minRevenue, maxRevenue));
    }
}