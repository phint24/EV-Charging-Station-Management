package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.ChargeSession;
import project.code.model.ChargingStation;
import project.code.model.Report;
import project.code.model.enums.ReportType;
import project.code.model.enums.SessionStatus;
import project.code.repository.ChargeSessionRepository;
import project.code.repository.ChargingStationRepository;
import project.code.repository.ReportRepository;

// (1) Import DTO
import project.code.dto.GenerateReportRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ChargingStationRepository stationRepository;
    private final ChargeSessionRepository chargeSessionRepository;

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Optional<Report> getReportById(Long reportId) {
        return reportRepository.findById(reportId);
    }

    public Report createReport(Report report) {
        return reportRepository.save(report);
    }

    public boolean deleteReport(Long reportId) {
        if (reportRepository.existsById(reportId)) {
            reportRepository.deleteById(reportId);
            return true;
        }
        return false;
    }

    public List<Report> getReportsByStationId(Long stationId) {
        ChargingStation station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Trạm ID: " + stationId));
        return reportRepository.findByStation(station);
    }

    public List<Report> getReportsByType(ReportType reportType) {
        return reportRepository.findByReportType(reportType);
    }

    public List<Report> getReportsByPeriod(LocalDateTime start, LocalDateTime end) {
        return reportRepository.findByPeriodStartBetween(start, end);
    }

    public List<Report> getReportsByStationAndPeriod(Long stationId, LocalDateTime start, LocalDateTime end) {
        ChargingStation station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Trạm ID: " + stationId));
        return reportRepository.findByStationAndPeriodStartBetween(station, start, end);
    }

    @Transactional
    public Report generateReport(GenerateReportRequest request, ReportType type) {

        ChargingStation station = stationRepository.findById(request.stationId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Trạm ID: " + request.stationId()));

        List<ChargeSession> sessions = chargeSessionRepository.findAllByStationAndStatusAndEndTimeBetween(
                station,
                SessionStatus.COMPLETED,
                request.periodStart(),
                request.periodEnd()
        );

        int totalSessions = sessions.size();
        double totalEnergy = sessions.stream().mapToDouble(ChargeSession::getEnergyUsed).sum();
        double totalRevenue = sessions.stream().mapToDouble(ChargeSession::getCost).sum();

        Report report = Report.builder()
                .reportType(type)
                .station(station)
                .periodStart(request.periodStart())
                .periodEnd(request.periodEnd())
                .totalSessions(totalSessions)
                .totalEnergy(totalEnergy)
                .totalRevenue(totalRevenue)
                .build();

        return reportRepository.save(report);
    }

    public Optional<Report> getTopRevenueReport() {
        return reportRepository.findTopByOrderByTotalRevenueDesc();
    }
    public Optional<Report> getTopEnergyReport() {
        return reportRepository.findTopByOrderByTotalEnergyDesc();
    }
    public List<Report> getAllReportsSortedByDate() {
        return reportRepository.findAllByOrderByPeriodStartDesc();
    }
    public List<Report> getReportsByMinSessions(int minSessions) {
        return reportRepository.findByTotalSessionsGreaterThanEqual(minSessions);
    }
    public List<Report> getReportsByRevenueRange(double minRevenue, double maxRevenue) {
        return reportRepository.findByTotalRevenueBetween(minRevenue, maxRevenue);
    }
}