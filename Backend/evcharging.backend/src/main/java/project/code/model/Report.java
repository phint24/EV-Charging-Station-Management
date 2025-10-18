package project.code.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    private String reportId;
    @Column(nullable = false, length = 100)
    private String reportType; // "revenue" or "usage"

    @Column(nullable = false)
    private LocalDateTime periodStart;

    @Column(nullable = false)
    private LocalDateTime periodEnd;

    @Column(nullable = false, length = 100)
    private String stationId;

    private int totalSessions;
    private double totalEnergy;
    private double totalRevenue;

    private LocalDateTime createdAt;

    public Report() {}

    // getters/setters...
    @PrePersist
    public void prePersist() { createdAt = LocalDateTime.now(); }
}

