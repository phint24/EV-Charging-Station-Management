package project.code.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "reports")
public class Report {
    @Id
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

    private LocalDateTime createdAt;

    public Report() {
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public void setPeriodStart(LocalDateTime periodStart) {
        this.periodStart = periodStart;
    }

    public void setPeriodEnd(LocalDateTime periodEnd) {
        this.periodEnd = periodEnd;
    }

    public void setStationId(String stationId) {
        this.stationId = stationId;
    }

}
