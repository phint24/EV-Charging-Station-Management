package project.code.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    
    @Id
    @Column(nullable = false, length = 100)
    private String reportId;

    @Column(nullable = false, length = 100)
    private String reportType;

    @Column(nullable = false)
    private LocalDateTime periodStart;

    @Column(nullable = false)
    private LocalDateTime periodEnd;

    @Column(nullable = false, length = 100)
    private String stationId;

    @Column(nullable = false)
    private int totalSessions;

    @Column(nullable = false)
    private double totalEnergy;

    @Column(nullable = false)
    private double totalRevenue;

    // Getters - Setters
    public String getReportId() {
        return reportId;
    }
    public void setReportId(String reportId) {
        this.reportId = reportId;
    }

    public String getReportType() {
        return reportType;
    }
    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public LocalDateTime getPeriodStart() {
        return periodStart;
    }
    public void setPeriodStart(LocalDateTime periodStart) {
        this.periodStart = periodStart;
    }

    public LocalDateTime getPeriodEnd() {
        return periodEnd;
    }
    public void setPeriodEnd(LocalDateTime periodEnd) {
        this.periodEnd = periodEnd;
    }

    public String getStationId() {
        return stationId;
    }
    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

    public int getTotalSessions() {
        return totalSessions;
    }
    public void setTotalSessions(int totalSessions) {
        this.totalSessions = totalSessions;
    }

    public double getTotalEnergy() {
        return totalEnergy;
    }
    public void setTotalEnergy(double totalEnergy) {
        this.totalEnergy = totalEnergy;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }
    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    // Methods
    public void revenueReport(String stationId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        System.out.println("Tạo báo cáo doanh thu cho trạm: " + stationId + " từ " + periodStart + " đến " + periodEnd);
    }

    public void usageReport(String stationId, LocalDateTime periodStart, LocalDateTime periodEnd) {
        System.out.println("Tạo báo cáo sử dụng cho trạm: " + stationId + " từ " + periodStart + " đến " + periodEnd);
    }

    public void displayReport(String reportId) {
        System.out.println("Hiển thị báo cáo: " + reportId);
    }
}