package project.code.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.code.model.Report;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {

    // Tìm report theo userId (nếu Report có trường userId)
    List<Report> findByUserId(String userId);

    // Tìm report theo khoảng thời gian (dựa trên periodStart / reportDate)
    List<Report> findByPeriodStartBetween(LocalDate start, LocalDate end);

    // Tìm theo trạng thái (ví dụ: "COMPLETED", "PENDING")
    List<Report> findByStatus(String status);

    // Lấy report có totalRevenue lớn nhất (trả Optional giống style Admin)
    Optional<Report> findTopByOrderByTotalRevenueDesc();

    // Lấy tất cả sắp xếp theo thời gian bắt đầu giảm dần
    List<Report> findAllByOrderByPeriodStartDesc();
}
