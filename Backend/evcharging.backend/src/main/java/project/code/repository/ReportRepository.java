package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.code.model.ChargingStation;
import project.code.model.Report;
import project.code.model.enums.ReportType; // Import Enum

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByStation(ChargingStation station);

    List<Report> findByReportType(ReportType reportType);

    List<Report> findByPeriodStartBetween(LocalDateTime start, LocalDateTime end);

    List<Report> findByStationAndPeriodStartBetween(ChargingStation station, LocalDateTime start, LocalDateTime end);

    Optional<Report> findTopByOrderByTotalRevenueDesc();

    Optional<Report> findTopByOrderByTotalEnergyDesc();

    List<Report> findAllByOrderByPeriodStartDesc();

    List<Report> findByTotalSessionsGreaterThanEqual(int minSessions);

    List<Report> findByTotalRevenueBetween(double minRevenue, double maxRevenue);
}