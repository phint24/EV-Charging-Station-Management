package project.code.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import project.code.model.Report;
import project.code.repository.ReportRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    // Lấy tất cả reports
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    // Lấy report theo ID
    public Optional<Report> getReportById(String reportId) {
        return reportRepository.findById(reportId);
    }

    // Tạo mới report
    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    // Cập nhật report
    public Report updateReport(String reportId, Report updatedReport) {
        return reportRepository.findById(reportId)
                .map(report -> {
                    report.setReportType(updatedReport.getReportType());
                    report.setPeriodStart(updatedReport.getPeriodStart());
                    report.setPeriodEnd(updatedReport.getPeriodEnd());
                    report.setStationId(updatedReport.getStationId());
                    report.setTotalSessions(updatedReport.getTotalSessions());
                    report.setTotalEnergy(updatedReport.getTotalEnergy());
                    report.setTotalRevenue(updatedReport.getTotalRevenue());
                    return reportRepository.save(report);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Report ID: " + reportId));
    }

    // Xóa report
    public boolean deleteReport(String reportId) {
        if (reportRepository.existsById(reportId)) {
            reportRepository.deleteById(reportId);
            return true;
        }
        return false;
    }

    // Lấy reports theo stationId
    public List<Report> getReportsByStationId(String stationId) {
        return reportRepository.findByStationId(stationId);
    }

    // Lấy reports theo reportType
    public List<Report> getReportsByType(String reportType) {
        return reportRepository.findByReportType(reportType);
    }

    // Lấy reports theo khoảng thời gian
    public List<Report> getReportsByPeriod(LocalDateTime start, LocalDateTime end) {
        return reportRepository.findByPeriodStartBetween(start, end);
    }

    // Lấy reports theo stationId và khoảng thời gian
    public List<Report> getReportsByStationAndPeriod(String stationId, LocalDateTime start, LocalDateTime end) {
        return reportRepository.findByStationIdAndPeriodStartBetween(stationId, start, end);
    }

    // Tạo báo cáo doanh thu (revenue report)
    public Report generateRevenueReport(String stationId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        Report report = Report.builder()
                .reportId("REV-" + System.currentTimeMillis())
                .reportType("Revenue Report")
                .stationId(stationId)
                .periodStart(periodStart)
                .periodEnd(periodEnd)
                .totalSessions(0)
                .totalEnergy(0.0)
                .totalRevenue(0.0)
                .build();
        
        report.revenueReport(stationId, periodStart, periodEnd);
        return reportRepository.save(report);
    }

    // Tạo báo cáo sử dụng (usage report)
    public Report generateUsageReport(String stationId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        Report report = Report.builder()
                .reportId("USE-" + System.currentTimeMillis())
                .reportType("Usage Report")
                .stationId(stationId)
                .periodStart(periodStart)
                .periodEnd(periodEnd)
                .totalSessions(0)
                .totalEnergy(0.0)
                .totalRevenue(0.0)
                .build();
        
        report.usageReport(stationId, periodStart, periodEnd);
        return reportRepository.save(report);
    }

    // Hiển thị report
    public void displayReport(String reportId) {
        Optional<Report> report = reportRepository.findById(reportId);
        if (report.isPresent()) {
            report.get().displayReport(reportId);
        } else {
            throw new RuntimeException("Không tìm thấy Report ID: " + reportId);
        }
    }

    // Lấy report có doanh thu cao nhất
    public Optional<Report> getTopRevenueReport() {
        return reportRepository.findTopByOrderByTotalRevenueDesc();
    }

    // Lấy report có năng lượng sử dụng cao nhất
    public Optional<Report> getTopEnergyReport() {
        return reportRepository.findTopByOrderByTotalEnergyDesc();
    }

    // Lấy tất cả reports sắp xếp theo thời gian
    public List<Report> getAllReportsSortedByDate() {
        return reportRepository.findAllByOrderByPeriodStartDesc();
    }

    // Lấy reports có số phiên sạc >= minSessions
    public List<Report> getReportsByMinSessions(int minSessions) {
        return reportRepository.findByTotalSessionsGreaterThanEqual(minSessions);
    }

    // Lấy reports theo khoảng doanh thu
    public List<Report> getReportsByRevenueRange(double minRevenue, double maxRevenue) {
        return reportRepository.findByTotalRevenueBetween(minRevenue, maxRevenue);
    }
}