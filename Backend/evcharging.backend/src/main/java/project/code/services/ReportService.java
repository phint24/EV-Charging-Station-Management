package project.code.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import project.code.model.*;
import project.code.model.enums.ReportType;
import project.code.model.enums.SessionStatus;
import project.code.repository.ChargeSessionRepository;
import project.code.repository.ChargingStationRepository;
import project.code.repository.ReportRepository;

import project.code.dto.report.GenerateReportRequest;
import project.code.dto.report.ReportDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ChargingStationRepository stationRepository;
    private final ChargeSessionRepository chargeSessionRepository;

    @Transactional(readOnly = true)
    public List<ReportDto> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ReportDto> getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .map(this::mapToDto);
    }

    @Transactional
    public ReportDto createReport(Report report) {
        Report savedReport = reportRepository.save(report);
        return mapToDto(savedReport);
    }

    public boolean deleteReport(Long reportId) {
        if (reportRepository.existsById(reportId)) {
            reportRepository.deleteById(reportId);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReportsByStationId(Long stationId) {
        ChargingStation station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Trạm ID: " + stationId));
        return reportRepository.findByStation(station).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReportsByType(ReportType reportType) {
        return reportRepository.findByReportType(reportType).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReportsByPeriod(LocalDateTime start, LocalDateTime end) {
        return reportRepository.findByPeriodStartBetween(start, end).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReportsByStationAndPeriod(Long stationId, LocalDateTime start, LocalDateTime end) {
        ChargingStation station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy Trạm ID: " + stationId));
        return reportRepository.findByStationAndPeriodStartBetween(station, start, end).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReportDto generateReport(GenerateReportRequest request, ReportType type) {

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

        Report savedReport = reportRepository.save(report);
        return mapToDto(savedReport);
    }

    @Transactional(readOnly = true)
    public Optional<ReportDto> getTopRevenueReport() {
        return reportRepository.findTopByOrderByTotalRevenueDesc()
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public Optional<ReportDto> getTopEnergyReport() {
        return reportRepository.findTopByOrderByTotalEnergyDesc()
                .map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getAllReportsSortedByDate() {
        return reportRepository.findAllByOrderByPeriodStartDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReportsByMinSessions(int minSessions) {
        return reportRepository.findByTotalSessionsGreaterThanEqual(minSessions).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReportDto> getReportsByRevenueRange(double minRevenue, double maxRevenue) {
        return reportRepository.findByTotalRevenueBetween(minRevenue, maxRevenue).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private ReportDto mapToDto(Report report) {
        return new ReportDto(
                report.getReportId(),
                report.getReportType(),
                report.getStation().getStationId(),
                report.getPeriodStart(),
                report.getPeriodEnd(),
                report.getTotalSessions(),
                report.getTotalEnergy(),
                report.getTotalRevenue()
        );
    }
}