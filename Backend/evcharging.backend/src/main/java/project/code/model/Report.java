package project.code.model;

import java.time.LocalDateTime;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

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
    public void setReportType(String reportType){
         this.reportType = reportType;
    }
     public void setPeriodStart(LocalDateTime periodStart){
         this.periodStart = periodStart;
    }
     public void setPeriodEnd(LocalDateTime periodEnd){
         this.periodEnd = periodEnd;
    }
     public void setStationId(String stationId){
         this.stationId = stationId;
    }
    

}

