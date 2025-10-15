package project.code.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    private String reportId;

    private String reportType; // "revenue" or "usage"

    private LocalDateTime periodStart;
    private LocalDateTime periodEnd;

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

