package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.Report;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {

    // Tìm report theo stationId
    List<Report> findByStationId(String stationId);

    // Tìm report theo reportType (ví dụ: "Charging Usage Report", "Revenue Report")
    List<Report> findByReportType(String reportType);

    // Tìm report theo khoảng thời gian (dựa trên periodStart)
    List<Report> findByPeriodStartBetween(LocalDateTime start, LocalDateTime end);

    // Tìm report theo khoảng thời gian (dựa trên periodEnd)
    List<Report> findByPeriodEndBetween(LocalDateTime start, LocalDateTime end);

    // Tìm report theo stationId và khoảng thời gian
    List<Report> findByStationIdAndPeriodStartBetween(String stationId, LocalDateTime start, LocalDateTime end);

    // Lấy report có totalRevenue lớn nhất
    Optional<Report> findTopByOrderByTotalRevenueDesc();

    // Lấy report có totalEnergy lớn nhất
    Optional<Report> findTopByOrderByTotalEnergyDesc();

    // Lấy tất cả sắp xếp theo periodStart giảm dần
    List<Report> findAllByOrderByPeriodStartDesc();

    // Lấy tất cả sắp xếp theo periodEnd giảm dần
    List<Report> findAllByOrderByPeriodEndDesc();

    // Tìm report theo stationId và reportType
    List<Report> findByStationIdAndReportType(String stationId, String reportType);

    // Tìm report có totalSessions lớn hơn hoặc bằng giá trị cho trước
    List<Report> findByTotalSessionsGreaterThanEqual(int minSessions);

    // Tìm report có totalRevenue trong khoảng [min, max]
    List<Report> findByTotalRevenueBetween(double minRevenue, double maxRevenue);
}